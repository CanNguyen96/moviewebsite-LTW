import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaRobot, 
    FaTimes, 
    FaPaperPlane, 
    FaTrashAlt, 
    FaFilm, 
    FaStar, 
    FaPlayCircle
} from 'react-icons/fa';
import { chatbotService } from '../../services/chatbotService';
import { buildImageSrc } from '../../utils/image';
import './ChatbotWidget.css';

const QUICK_PROMPTS = [
    "🎬 Gợi ý phim hot nhất",
    "💥 Phim hành động hay",
    "⭐ Phim điểm cao",
    "❤️ Cách lưu phim yêu thích"
];

function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState(() => {
        return [
            {
                id: 'welcome-1',
                sender: 'bot',
                text: 'Xin chào! Tôi là Trợ Lý AI của MovieWebsite 🍿\nTôi có thể giúp bạn tìm kiếm phim, gợi ý phim theo thể loại hoặc giải đáp các thắc mắc.',
                recommendedMovies: []
            }
        ];
    });

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, messages, loading]);

    // Xóa lịch sử chat
    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome-reset',
                sender: 'bot',
                text: 'Đã làm mới cuộc trò chuyện. Tôi có thể giúp gì cho bạn?',
                recommendedMovies: []
            }
        ]);
    };

    // Gửi tin nhắn
    const handleSend = async (textToSend) => {
        const queryText = (textToSend || input).trim();
        if (!queryText || loading) return;

        const userMsgId = Date.now().toString();
        const newUserMessage = {
            id: userMsgId,
            sender: 'user',
            text: queryText
        };

        // Chuẩn bị lịch sử hội thoại cho Gemini (bỏ qua welcome msg)
        const chatHistoryForAPI = messages
            .filter(m => m.id !== 'welcome-1' && m.id !== 'welcome-reset')
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setLoading(true);

        try {
            const data = await chatbotService.sendMessage(queryText, chatHistoryForAPI);

            const botMsgId = (Date.now() + 1).toString();
            const newBotMessage = {
                id: botMsgId,
                sender: 'bot',
                text: data.reply || 'Cảm ơn bạn đã nhắn tin!',
                recommendedMovies: data.recommendedMovies || []
            };

            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMsg = error.response?.data?.error || 'Rất tiếc, đã có lỗi xảy ra. Bạn vui lòng thử lại sau nhé!';
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: 'bot',
                text: errorMsg,
                recommendedMovies: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const [showGreeting, setShowGreeting] = useState(false);

    // Hiển thị bóng bóng chào mừng 1 lần duy nhất cho người dùng mới
    useEffect(() => {
        const hasSeenGreeting = localStorage.getItem('chatbot_greeting_seen');
        if (!hasSeenGreeting) {
            const timer = setTimeout(() => {
                setShowGreeting(true);
            }, 2000); // Hiện thông báo sau 2 giây khi mới vào trang
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismissGreeting = (e) => {
        if (e) e.stopPropagation();
        setShowGreeting(false);
        localStorage.setItem('chatbot_greeting_seen', 'true');
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        if (showGreeting) {
            handleDismissGreeting();
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Nút bấm mở Chatbot Floating Action Button */}
            {!isOpen && (
                <div className="chatbot-fab-container">
                    {showGreeting && (
                        <div className="chatbot-greeting-tooltip">
                            <span>👋 Chào bạn! Bạn cần tôi gợi ý hay tìm giúp phim gì không?</span>
                            <button 
                                className="greeting-close-btn"
                                onClick={handleDismissGreeting}
                                title="Đóng thông báo"
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    )}
                    <button 
                        className="chatbot-fab"
                        onClick={handleOpenChat}
                        title="Trò chuyện với AI Trợ lý phim"
                        aria-label="Mở AI Chatbot"
                    >
                        <div className="chatbot-fab-icon">
                            <FaRobot size={26} />
                        </div>
                    </button>
                </div>
            )}



            {/* Cửa sổ Chatbot Popup */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar-container">
                                <FaRobot size={20} className="chatbot-avatar-icon" />
                                <span className="online-indicator"></span>
                            </div>
                            <div>
                                <h3 className="chatbot-title">AI Trợ Lý Xem Phim</h3>
                                <p className="chatbot-subtitle">MovieWebsite AI • Trực tuyến</p>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button 
                                className="chatbot-icon-btn" 
                                onClick={handleClearChat}
                                title="Xóa lịch sử chat"
                            >
                                <FaTrashAlt size={14} />
                            </button>
                            <button 
                                className="chatbot-icon-btn" 
                                onClick={() => setIsOpen(false)}
                                title="Đóng"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Danh sách tin nhắn */}
                    <div className="chatbot-body">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`chat-message-row ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="bot-msg-avatar">
                                        <FaRobot size={14} />
                                    </div>
                                )}
                                <div className="message-content-wrapper">
                                    <div className="message-bubble">
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>

                                    {/* Khối hiển thị các bộ phim gợi ý (nếu có) */}
                                    {msg.recommendedMovies && msg.recommendedMovies.length > 0 && (
                                        <div className="recommended-movies-section">
                                            <div className="recommended-title">
                                                <FaFilm className="icon-film" /> Phim đề xuất cho bạn:
                                            </div>
                                            <div className="recommended-movies-grid">
                                                {msg.recommendedMovies.map((movie) => (
                                                    <div 
                                                        key={movie.id} 
                                                        className="movie-recommend-card"
                                                        onClick={() => handleMovieClick(movie.id)}
                                                    >
                                                        <img 
                                                            src={buildImageSrc(movie.image_url)} 
                                                            alt={movie.title} 
                                                            className="movie-card-poster"
                                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                        />
                                                        <div className="movie-card-info">
                                                            <h4 className="movie-card-title">{movie.title}</h4>
                                                            <div className="movie-card-meta">
                                                                <span className="movie-card-genre">{movie.genre}</span>
                                                                {movie.rating && (
                                                                    <span className="movie-card-rating">
                                                                        <FaStar className="star-icon" /> {movie.rating}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button className="watch-now-btn">
                                                                <FaPlayCircle /> Xem ngay
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="chat-message-row message-bot">
                                <div className="bot-msg-avatar">
                                    <FaRobot size={14} />
                                </div>
                                <div className="message-bubble loading-bubble">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestion prompt chips */}
                    <div className="quick-prompts-container">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                            <button
                                key={idx}
                                className="quick-prompt-chip"
                                onClick={() => handleSend(prompt)}
                                disabled={loading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Footer Input Area */}
                    <div className="chatbot-footer">
                        <div className="input-container">
                            <textarea
                                ref={inputRef}
                                className="chatbot-input"
                                placeholder="Hỏi AI về phim, gợi ý..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                disabled={loading}
                            />
                            <button
                                className="send-btn"
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                title="Gửi tin nhắn"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatbotWidget;
