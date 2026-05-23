import { useEffect, useState, useRef } from "react";
import styles from "../styles/Slider.module.css";
import { movieService } from "../services/movieService";
import { useNavigate } from 'react-router-dom';
import { buildImageSrc } from '../utils/image';
import { FaPlay } from 'react-icons/fa';

const AnimeSlider = () => {
    const [sliderData, setSliderData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        movieService.getSliderMovies()
            .then(data => {
                setSliderData(data || []);
            })
            .catch(err => console.error("Lỗi lấy danh sách slider:", err));
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (sliderData.length === 0) return;

        // Clear existing interval
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
        }, 6000); // 6s per slide

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sliderData, activeIndex]);

    const handleWatchClick = (movieId) => {
        if (movieId) {
            navigate(`/movieDetail/${movieId}`);
        } else {
            console.warn(`Không thể chuyển hướng chi tiết phim`);
        }
    };

    if (sliderData.length === 0) {
        return <div className={styles['loading-slider']}>Đang tải slide...</div>;
    }

    const activeSlide = sliderData[activeIndex];

    return (
        <div className={styles['slider-wrapper']}>
            {/* Main active slide */}
            <div className={styles['active-slide']}>
                {/* Background Banner */}
                <div className={styles['slide-background']}>
                    <img 
                        src={buildImageSrc(activeSlide.background_url)} 
                        alt={activeSlide.title} 
                    />
                    <div className={styles['gradient-overlay']}></div>
                </div>

                {/* Left side content */}
                <div className={styles['slide-content']}>
                    <h1 className={styles['slide-title']}>{activeSlide.title}</h1>
                    
                    {/* Badges row */}
                    <div className={styles['badges-row']}>
                        {activeSlide.release_year && (
                            <span className={styles['badge-year']}>
                                {activeSlide.release_year}
                            </span>
                        )}
                        <span className={styles['badge-episode']}>
                            Tập {activeSlide.latest_episode || 1}
                        </span>
                        {activeSlide.genre && (
                            <span className={styles['badge-genre']}>
                                {activeSlide.genre.split(',')[0]}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className={styles['slide-description']}>
                        {activeSlide.description}
                    </p>

                    {/* Play button */}
                    <button 
                        className={styles['play-button']} 
                        onClick={() => handleWatchClick(activeSlide.movie_id)}
                        aria-label="Xem phim"
                    >
                        <FaPlay className={styles['play-icon']} />
                    </button>
                </div>
            </div>

            {/* Thumbnail pagination row */}
            <div className={styles['thumbnails-container']}>
                <div className={styles['thumbnails-row']}>
                    {sliderData.map((slide, index) => (
                        <div 
                            key={slide.movie_id} 
                            className={`${styles['thumbnail-item']} ${index === activeIndex ? styles['active-thumbnail'] : ''}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <img 
                                src={buildImageSrc(slide.image_url)} 
                                alt={slide.title} 
                                className={styles['thumbnail-img']}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimeSlider;