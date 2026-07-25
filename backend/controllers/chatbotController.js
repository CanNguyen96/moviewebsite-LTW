const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

// Controller xử lý tin nhắn chat từ người dùng
const handleChat = async (req, res, next) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.includes('your_gemini_api_key')) {
            return res.status(500).json({
                error: 'Cấu hình GEMINI_API_KEY chưa hợp lệ. Vui lòng lấy API Key miễn phí tại https://aistudio.google.com/ và điền vào file .env.'
            });
        }



        // 1. Lấy danh sách phim đã duyệt (Approved) từ MySQL làm ngữ cảnh cho AI
        const moviesQuery = `
            SELECT 
                movie_id AS id,
                title,
                genre,
                release_year,
                duration,
                description,
                average_rating AS rating,
                image_url
            FROM movies
            WHERE status = 'Approved'
            ORDER BY movie_id DESC
            LIMIT 50
        `;
        const [movies] = await db.query(moviesQuery);

        const moviesContext = movies.map(m => ({
            id: m.id,
            title: m.title ? m.title.trim() : '',
            genre: m.genre || 'Chưa phân loại',
            year: m.release_year,
            rating: m.rating ? parseFloat(m.rating).toFixed(1) : 'Chưa có đánh giá',
            description: m.description ? m.description.slice(0, 150) + '...' : ''
        }));

        // 2. Khởi tạo Gemini AI SDK và danh sách mô hình ứng viên chính thức đang hoạt động mượt mà
        const genAI = new GoogleGenerativeAI(apiKey);
        const candidateModels = [
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-flash-latest'
        ];




        const systemInstruction = `
Bạn là AI Trợ lý xem phim thông minh, thân thiện của website "MovieWebsite".
Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Việt tự nhiên, ngắn gọn, lịch sự và hào hứng.
2. Gợi ý phim hoặc trả lời thắc mắc DỰA VÀO danh sách phim có sẵn trong hệ thống MovieWebsite bên dưới.
3. Nếu người dùng hỏi bộ phim KHÔNG CÓ trong danh sách, hãy thông báo lịch sự là hệ thống chưa cập nhật phim đó và chủ động gợi ý các phim cùng thể loại có sẵn trên web.
4. Hướng dẫn tính năng trang web nếu người dùng hỏi (đăng ký/đăng nhập, tìm kiếm, lưu phim yêu thích, đánh giá phim...).
5. Khi bạn gợi ý một hoặc nhiều bộ phim từ danh sách, hãy ĐẶT KHỐI JSON GỢI Ý Ở ĐẦU CÂU TRẢ LỜI theo đúng định dạng chính xác sau (không đổi tên key):
<<<RECOMMENDED_MOVIES:[{"id": 1, "title": "Tên Phim"}]>>>

Danh sách phim hiện có trên hệ thống MovieWebsite (tối đa 50 phim mới nhất):
${JSON.stringify(moviesContext, null, 2)}
`;

        // 3. Chuẩn bị lịch sử trò chuyện đúng chuẩn Gemini SDK
        const formattedHistory = [
            {
                role: 'user',
                parts: [{ text: systemInstruction }]
            },
            {
                role: 'model',
                parts: [{ text: 'Đã hiểu! Tôi là AI Trợ lý xem phim MovieWebsite. Tôi sẵn sàng hỗ trợ người dùng lựa chọn và tìm kiếm những bộ phim hay nhất trên hệ thống.' }]
            }
        ];

        // Thêm lịch sử hội thoại trước đó (nếu có)
        if (Array.isArray(history)) {
            history.forEach(item => {
                if (item.role && item.parts && Array.isArray(item.parts)) {
                    formattedHistory.push({
                        role: item.role === 'user' ? 'user' : 'model',
                        parts: item.parts.map(p => ({ text: p.text || '' }))
                    });
                }
            });
        }

        // 4. Thử lần lượt các mô hình Gemini
        let responseText = null;
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const chatSession = model.startChat({
                    history: formattedHistory,
                    generationConfig: {
                        maxOutputTokens: 1500,
                        temperature: 0.7,
                    },
                });

                const result = await chatSession.sendMessage(message);
                responseText = result.response.text();
                if (responseText) {
                    // Thành công, thoát vòng lặp
                    break;
                }
            } catch (modelErr) {
                console.warn(`Gemini Model [${modelName}] failed:`, modelErr.message || modelErr);
                lastError = modelErr;
            }
        }

        if (!responseText) {
            throw lastError || new Error('Không thể kết nối đến bất kỳ mô hình Gemini nào.');
        }

        // 5. Trích xuất danh sách phim gợi ý dạng JSON từ responseText (nếu có)
        let recommendedMovies = [];
        let cleanText = responseText;

        const completeMatch = responseText.match(/<<<RECOMMENDED_MOVIES:\s*(\[[\s\S]*?\])\s*>>>/);

        const movieMap = new Map(movies.map(m => [m.id, m]));

        if (completeMatch && completeMatch[1]) {
            try {
                const parsedList = JSON.parse(completeMatch[1]);
                cleanText = responseText.replace(completeMatch[0], '').trim();

                const recommendedIds = parsedList.map(item => Number(item.id)).filter(Boolean);
                if (recommendedIds.length > 0) {
                    recommendedMovies = recommendedIds.map(id => movieMap.get(id)).filter(Boolean);
                }
            } catch (e) {
                console.error('Error parsing recommended movies JSON from Gemini:', e);
            }
        } else {
            // Trường hợp thẻ bị dở dang/cắt ngang hoặc không đóng đúng chuẩn
            const partialMatch = responseText.match(/<<<RECOMMENDED_MOVIES:[\s\S]*/);
            if (partialMatch) {
                const tagText = partialMatch[0];
                cleanText = responseText.replace(tagText, '').trim();

                const idMatches = [...tagText.matchAll(/["']?id["']?\s*:\s*(\d+)/gi)];
                const extractedIds = idMatches.map(m => parseInt(m[1], 10)).filter(Boolean);
                if (extractedIds.length > 0) {
                    recommendedMovies = extractedIds.map(id => movieMap.get(id)).filter(Boolean);
                }
            }
        }

        // Đảm bảo lọc sạch hoàn toàn bất kỳ ký tự thẻ dư thừa nào trước khi gửi về Client
        cleanText = cleanText.replace(/<<<RECOMMENDED_MOVIES[\s\S]*/gi, '').trim();

        res.json({
            reply: cleanText,
            recommendedMovies: recommendedMovies
        });

    } catch (err) {
        console.error('Chatbot Controller Error:', err);
        let errorMsg = 'Có lỗi xảy ra khi kết nối tới Trợ lý AI. Vui lòng thử lại sau.';
        if (err.message && (err.message.includes('429') || err.message.includes('Quota') || err.message.includes('limit'))) {
            errorMsg = 'Hệ thống Gemini AI hiện đang bận hoặc chạm giới hạn lượt gọi (429 Quota Exceeded). Vui lòng thử lại sau ít phút hoặc tạo API Key mới tại aistudio.google.com.';
        }
        res.status(500).json({
            error: errorMsg
        });
    }
};

module.exports = {
    handleChat
};

