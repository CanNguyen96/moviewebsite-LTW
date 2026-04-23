import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsVideoPlayer = ({ src, styles }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(err => {
                    console.log("Trình duyệt chặn autoplay âm thanh, người dùng cần bấm play thủ công:", err);
                });
            });
        }
        // Hỗ trợ riêng cho trình duyệt Safari (Native HLS)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', function () {
                video.play().catch(err => console.log(err));
            });
        }

        // Cleanup (Dọn dẹp hls khi đổi tập hoặc rời trang)
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video 
            ref={videoRef} 
            controls 
            className={styles && styles['react-player-styled'] ? styles['react-player-styled'] : ''} 
            style={{ width: '100%', height: '100%', backgroundColor: '#000', outline: 'none' }}
        />
    );
};

export default HlsVideoPlayer;
