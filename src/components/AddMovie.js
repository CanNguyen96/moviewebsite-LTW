import axios from "axios";
import "../styles/AddMovie.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilm, FaCalendarAlt, FaClock, FaAlignLeft, FaImage, FaImages, FaTag, FaTimes } from 'react-icons/fa';

function AddMovie() {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const [formData, setFormData] = useState({
        title: '',
        release_year: '',
        duration: '',
        description: '',
        image: null,
        background: null,
        status: 'Pending'
    });
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryRef = useRef(null);
    const navigate = useNavigate();

    // Fetch all categories from API
    useEffect(() => {
        let isMounted = true;

        axios
            .get(`${API_BASE_URL}/api/categories`)
            .then((res) => {
                if (!isMounted) return;

                const raw = Array.isArray(res.data) ? res.data : [];
                const normalized = raw
                    .map((c) => ({
                        category_id: c.category_id,
                        name: c.category_name ?? c.name,
                    }))
                    .filter((c) => Boolean(c.category_id) && Boolean(c.name));

                setAllCategories(normalized);
            })
            .catch((err) => {
                console.error("Không thể tải danh sách thể loại:", err);
                if (!isMounted) return;
                setAllCategories([]);
            });

        return () => {
            isMounted = false;
        };
    }, [API_BASE_URL]);

    // Handle clicking outside the category dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [categoryRef]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
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

        if (
            !formData.title || !formData.description || !formData.release_year ||
            !formData.duration || selectedCategories.length === 0 || !formData.image || !formData.background
        ) {
            alert("Vui lòng điền đầy đủ thông tin, chọn ít nhất một thể loại và tải lên đủ các ảnh!");
            return;
        }

        const formPayload = new FormData();
        formPayload.append("title", formData.title);
        formPayload.append("genre", genreString);
        formPayload.append("release_year", parseInt(formData.release_year));
        formPayload.append("duration", parseInt(formData.duration));
        formPayload.append("description", formData.description);
        formPayload.append("status", formData.status);
        formPayload.append("image", formData.image);
        formPayload.append("background", formData.background);

        axios
            .post(`${API_BASE_URL}/api/movies/add`, formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((response) => {
                alert("Thêm phim thành công!");
                navigate(-1);
            })
            .catch((error) => {
                console.error("Lỗi khi thêm phim:", error);
                if (error.response?.data?.error) {
                    alert(`Thêm phim thất bại: ${error.response.data.error}`);
                } else {
                    alert("Thêm phim thất bại. Vui lòng thử lại.");
                }
            });
    };

    return (
        <div className="add-movie-container">
            <h2>Thêm Phim Mới</h2>
            <form className="add-movie-form" onSubmit={handleSubmit}>
                <div className="form-main-content">
                    {/* Cột trái */}
                    <div className="form-column left">
                        <div className="form-group">
                            <label><FaFilm /> Tên phim</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
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
                                <input type="number" name="release_year" value={formData.release_year} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label><FaClock /> Thời lượng (phút)</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><FaAlignLeft /> Mô tả</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" required></textarea>
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="form-column right">
                        <div className="form-group">
                            <label><FaImage /> Poster (Ảnh dọc)</label>
                            <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
                        </div>
                        <div className="form-group">
                            <label><FaImages /> Ảnh nền (Background ngang)</label>
                            <input type="file" name="background" accept="image/*" onChange={handleFileChange} required />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit" className="submit-button">Thêm Phim</button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-button">Hủy</button>
                </div>
            </form>
        </div>
    );
}
export default AddMovie;