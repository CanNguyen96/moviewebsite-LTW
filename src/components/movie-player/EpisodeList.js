import React from "react";

const EpisodeList = ({ movie, currentEpisode, onEpisodeClick, styles }) => {
    return (
        <div className={styles['episode-list-card']}>
            <h3>DANH SÁCH TẬP</h3>
            <div className={styles['episodes-grid']}>
                {Array.isArray(movie.episodes) && movie.episodes.length > 0 ? (
                    [...movie.episodes]
                        .sort((a, b) => Number(a.episode) - Number(b.episode))
                        .map((ep, index) => (
                        <button
                            key={`episode-${index}`}
                            className={`${styles['ep-btn']} ${Number(ep.episode) === Number(currentEpisode?.episode) ? styles.active : ""}`}
                            onClick={() => onEpisodeClick(ep)}
                        >
                            {ep.episode}
                        </button>
                    ))
                ) : (
                    <p className={styles['text-muted']}>Hiện chưa có tập phim.</p>
                )}
            </div>
        </div>
    );
};

export default EpisodeList;
