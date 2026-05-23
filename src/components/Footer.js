import React from 'react';
import styles from '../styles/Footer.module.css';
import { FaTwitter, FaTelegramPlane, FaRedditAlien } from 'react-icons/fa';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.brand}>ANIME69.WEBSITE</div>
          <div className={styles.copyright}>
            Copyright © 2026 Anime69 - Anime Vietsub Online | Anime69. All Rights Reserved
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.socials}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles['social-icon']} aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className={styles['social-icon']} aria-label="Telegram">
              <FaTelegramPlane />
            </a>
            <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className={styles['social-icon']} aria-label="Reddit">
              <FaRedditAlien />
            </a>
          </div>
          <p className={styles.disclaimer}>
            Trang web này không lưu trữ bất kỳ tệp nào trên máy chủ của mình. Mọi nội dung đều được cung cấp bởi bên thứ ba không liên kết.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
