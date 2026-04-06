import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilm, FaCalendarAlt, FaClock, FaAlignLeft, FaImage, FaImages, FaTag, FaTimes, FaSave, FaTimesCircle, FaPlusSquare } from 'react-icons/fa';
import '../styles/AddMovie.css'; // Tái sử dụng CSS từ AddMovie
import '../styles/EditMovie.css';

function EditMovie() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const [movie, setMovie] = useState({
        title: '',
        release_year: '',
        duration: '',
        status: '',
        description: '',
        image_url: '',
        background_url: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);
    
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Fetch all available categories
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/categories`)
            .then(({ data }) => {
                const raw = Array.isArray(data) ? data : [];
                const normalized = raw.map(c => ({
                    category_id: c.category_id,
                    name: c.category_name || c.name,
                })).filter(Boolean);
                setAllCategories(normalized);
            })
            .catch(err => console.error('Không thể tải danh sách thể loại:', err));
    }, [API_BASE_URL]);

    // 2. Fetch movie details
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/movies/${movieId}/edit`)
            .then(({ data }) => {
                setMovie({
                    title: data.title || '',
                    release_year: data.release_year?.toString() || '',
                    duration: data.duration?.toString() || '',
                    status: data.status || 'Pending',
                    description: data.description || '',
                    image_url: data.image_url || '',
                    background_url: data.background_url || '',
                });
                
                // Pre-select categories based on fetched movie genre
                const movieGenres = (Array.isArray(data.genre) ? data.genre : (data.genre || '').split(',')).map(g => g.trim());
                if (allCategories.length > 0) {
                    const preSelected = allCategories.filter(cat => movieGenres.includes(cat.name));
                    setSelectedCategories(preSelected);
                }
                
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi lấy dữ liệu phim:', err);
                setError('Đã xảy ra lỗi khi tải thông tin phim.');
                setLoading(false);
            });
    }, [movieId, API_BASE_URL, allCategories]); // Re-run when allCategories is populated

    // Handle clicking outside the category dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categoryRef]);

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'image') setImageFile(e.target.files[0]);
        if (e.target.name === 'background') setBackgroundFile(e.target.files[0]);
    };

    const handleCategorySelect = (category) => {
        if (!selectedCategories.find(c => c.category_id === category.category_id)) {
            setSelectedCategories([...selectedCategories, category]);
        }
        setIsCategoryDropdownOpen(false);
    };

    const handleRemoveCategory = (categoryToRemove) => {
        setSelectedCategories(selectedCategories.filter(c => c.category_id !== categoryToRemove.category_id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const genreString = selectedCategories.map(c => c.name).join(', ');

        const formData = new FormData();
        formData.append('title', movie.title);
        formData.append('genre', genreString);
        formData.append('release_year', movie.release_year);
        formData.append('duration', movie.duration);
        formData.append('status', movie.status);
        formData.append('description', movie.description);

        if (imageFile) formData.append('image', imageFile);
        else formData.append('existing_image_url', movie.image_url);

        if (backgroundFile) formData.append('background', backgroundFile);
        else formData.append('existing_background_url', movie.background_url);

        axios.put(`${API_BASE_URL}/api/movies/${movieId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
            alert("Cập nhật thành công!");
            navigate('/managemovie');
        })
        .catch(err => {
            console.error("Lỗi cập nhật:", err.response ? err.response.data : err.message);
            setError('Đã xảy ra lỗi khi cập nhật thông tin phim.');
        });
    };

    if (loading) return <div className="loading-container">Đang tải thông tin phim...</div>;
    if (error) return <div className="error-container">Lỗi: {error}</div>;

    return (
        <div className="add-movie-container">
            <h2>Sửa Thông Tin Phim</h2>
            <form className="add-movie-form" onSubmit={handleSubmit}>
                <div className="form-main-content">
                    {/* Cột trái */}
                    <div className="form-column left">
                        <div className="form-group">
                            <label><FaFilm /> Tên phim</label>
                            <input type="text" name="title" value={movie.title} onChange={handleChange} required />
                        </div>

                        <div className="form-group" ref={categoryRef}>
                            <label><FaTag /> Thể loại</label>
                            <div className="custom-select-wrapper" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                                <div className="selected-categories-display">
                                    {selectedCategories.length > 0 ? (
                                        selectedCategories.map(cat => (
                                            <span key={cat.category_id} className="category-tag">
                                                {cat.name}
                                                <FaTimes onClick={(e) => { e.stopPropagation(); handleRemoveCategory(cat); }} />
                                            </span>
                                        ))
                                    ) : (
                                        <span className="placeholder">Chọn thể loại...</span>
                                    )}
                                </div>
                            </div>
                            {isCategoryDropdownOpen && (
                                <div className="category-dropdown">
                                    {allCategories.length > 0 ? (
                                        allCategories.map((cat) => (
                                            <div key={cat.category_id} className="dropdown-item" onClick={() => handleCategorySelect(cat)}>
                                                {cat.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item dropdown-empty">Không có thể loại</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label><FaCalendarAlt /> Năm phát hành</label>
                                <input type="number" name="release_year" value={movie.release_year} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label><FaClock /> Thời lượng (phút)</label>
                                <input type="number" name="duration" value={movie.duration} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><FaAlignLeft /> Mô tả</label>
                            <textarea name="description" value={movie.description} onChange={handleChange} rows="6" required></textarea>
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="form-column right">
                        <div className="form-group">
                            <label><FaImage /> Poster (Ảnh dọc)</label>
                            <div className="file-info">
                                <span>{imageFile ? imageFile.name : (movie.image_url || '').split('/').pop() || 'Chưa có ảnh'}</span>
                            </div>
                            <input type="file" name="image" id="image-upload" className="file-input-hidden" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="image-upload" className="file-input-label">Chọn file khác</label>
                        </div>
                        <div className="form-group">
                            <label><FaImages /> Ảnh nền (Background ngang)</label>
                            <div className="file-info">
                                <span>{backgroundFile ? backgroundFile.name : (movie.background_url || '').split('/').pop() || 'Chưa có ảnh'}</span>
                            </div>
                            <input type="file" name="background" id="background-upload" className="file-input-hidden" accept="image/*" onChange={handleFileChange} />
                             <label htmlFor="background-upload" className="file-input-label">Chọn file khác</label>
                        </div>
                         <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="status" value={movie.status} onChange={handleChange}>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="button" onClick={() => navigate(`/admin/episodes/${movieId}`)} className="add-episode-button">
                        <FaPlusSquare /> Quản lý tập phim
                    </button>
                    <div className="button-actions">
                        <button type="submit" className="submit-button"><FaSave /> Lưu Thay Đổi</button>
                        <button type="button" onClick={() => navigate('/managemovie')} className="cancel-button"><FaTimesCircle /> Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditMovie;