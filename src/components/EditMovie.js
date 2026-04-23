import { useState, useEffect, useRef } from 'react';
import { movieService } from '../services/movieService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFilm, FaCalendarAlt, FaClock, FaAlignLeft, FaImage, FaImages, FaTag, FaTimes, FaSave, FaTimesCircle, FaPlusSquare } from 'react-icons/fa';
import addStyles from '../styles/AddMovie.module.css';
import styles from '../styles/EditMovie.module.css';

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
        movieService.getCategories()
            .then((data) => {
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
        movieService.getMovieForEdit(movieId)
            .then((data) => {
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

        movieService.updateMovie(movieId, formData)
            .then(() => {
                toast.success("Cập nhật thành công!");
                setTimeout(() => {
                    navigate('/managemovie');
                }, 1500);
            })
            .catch(err => {
                console.error("Lỗi cập nhật:", err);
                toast.error('Đã xảy ra lỗi khi cập nhật thông tin phim.');
                setError('Đã xảy ra lỗi khi cập nhật thông tin phim.');
            });
    };

    if (loading) return <div className={styles['loading-container']}>Đang tải thông tin phim...</div>;
    if (error) return <div className={styles['error-container']}>Lỗi: {error}</div>;

    return (
        <div className={addStyles['add-movie-container']}>
            <ToastContainer />
            <h2>Sửa Thông Tin Phim</h2>
            <form className={addStyles['add-movie-form']} onSubmit={handleSubmit}>
                <div className={addStyles['form-main-content']}>
                    {/* Cột trái */}
                    <div className={`${addStyles['form-column']} ${addStyles.left}`}>
                        <div className={addStyles['form-group']}>
                            <label><FaFilm /> Tên phim</label>
                            <input type="text" name="title" value={movie.title} onChange={handleChange} required />
                        </div>

                        <div className={addStyles['form-group']} ref={categoryRef}>
                            <label><FaTag /> Thể loại</label>
                            <div className={addStyles['custom-select-wrapper']} onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                                <div className={addStyles['selected-categories-display']}>
                                    {selectedCategories.length > 0 ? (
                                        selectedCategories.map(cat => (
                                            <span key={cat.category_id} className={addStyles['category-tag']}>
                                                {cat.name}
                                                <FaTimes onClick={(e) => { e.stopPropagation(); handleRemoveCategory(cat); }} />
                                            </span>
                                        ))
                                    ) : (
                                        <span className={addStyles.placeholder}>Chọn thể loại...</span>
                                    )}
                                </div>
                            </div>
                            {isCategoryDropdownOpen && (
                                <div className={addStyles['category-dropdown']}>
                                    {allCategories.length > 0 ? (
                                        allCategories.map((cat) => (
                                            <div key={cat.category_id} className={addStyles['dropdown-item']} onClick={() => handleCategorySelect(cat)}>
                                                {cat.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className={`${addStyles['dropdown-item']} ${addStyles['dropdown-empty']}`}>Không có thể loại</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={addStyles['form-group-row']}>
                            <div className={addStyles['form-group']}>
                                <label><FaCalendarAlt /> Năm phát hành</label>
                                <input type="number" name="release_year" value={movie.release_year} onChange={handleChange} required />
                            </div>
                            <div className={addStyles['form-group']}>
                                <label><FaClock /> Thời lượng (phút)</label>
                                <input type="number" name="duration" value={movie.duration} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={addStyles['form-group']}>
                            <label><FaAlignLeft /> Mô tả</label>
                            <textarea name="description" value={movie.description} onChange={handleChange} rows="6" required></textarea>
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className={`${addStyles['form-column']} ${addStyles.right}`}>
                        <div className={addStyles['form-group']}>
                            <label><FaImage /> Poster (Ảnh dọc)</label>
                            <div className={styles['file-info']}>
                                <span>{imageFile ? imageFile.name : (movie.image_url || '').split('/').pop() || 'Chưa có ảnh'}</span>
                            </div>
                            <input type="file" name="image" id="image-upload" className={styles['file-input-hidden']} accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="image-upload" className={styles['file-input-label']}>Chọn file khác</label>
                        </div>
                        <div className={addStyles['form-group']}>
                            <label><FaImages /> Ảnh nền (Background ngang)</label>
                            <div className={styles['file-info']}>
                                <span>{backgroundFile ? backgroundFile.name : (movie.background_url || '').split('/').pop() || 'Chưa có ảnh'}</span>
                            </div>
                            <input type="file" name="background" id="background-upload" className={styles['file-input-hidden']} accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="background-upload" className={styles['file-input-label']}>Chọn file khác</label>
                        </div>
                        <div className={addStyles['form-group']}>
                            <label>Trạng thái</label>
                            <select name="status" value={movie.status} onChange={handleChange}>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles['button-container']}>
                    <button type="button" onClick={() => navigate(`/admin/episodes/${movieId}`)} className={styles['add-episode-button']}>
                        <FaPlusSquare /> Quản lý tập phim
                    </button>
                    <div className={styles['button-actions']}>
                        <button type="submit" className={styles['submit-button']}><FaSave /> Lưu Thay Đổi</button>
                        <button type="button" onClick={() => navigate('/managemovie')} className={styles['cancel-button']}><FaTimesCircle /> Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditMovie;