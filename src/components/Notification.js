"use client"
import styles from "../styles/Notification.module.css";

function Notification(){
    return(
        <div className={styles.Notification}>
          <ul>
            <li>Khám phá kho tàng anime vietsub phong phú tại <span>AnimeVietsub!</span></li>
            <li>Đăng nhập để theo dõi tiến độ xem và nhận đề xuất phim phù hợp <span>ngay bây giờ!</span></li>
            <li>Tham gia cộng đồng fan anime và chia sẻ cảm nhận của bạn <span>tại đây!</span></li>
          </ul>
        </div>
    )
  }
export default Notification;