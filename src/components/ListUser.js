import {useEffect,useState} from 'react';
import styles from '../styles/ListUser.module.css';
import {Link} from 'react-router-dom';
import { userService } from '../services/userService';

function ListUser() {
  const [users, setUsers] = useState([]);
    // Gọi API khi component mount
    useEffect(() => {
        userService.getUsers()
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            })
            .catch((err) => {
                console.error('Lỗi lấy danh sách user:', err);
                setUsers([]);
            });
    }, []);
  return (
    <div className={styles['list-users']}>
      <div className={styles['list-user-tag']}>
        <li>Quản lý tài khoản</li>
      </div>
        {/* Header row */}
        <div className={`${styles['user-item']} ${styles.header}`}>
          <div className="name"><li>Tên</li></div>
          <div className="email"><li>Email</li></div>
          <div className="role"><li>Role</li></div>
          <div className={styles.status}><li>Trạng thái</li></div>
        </div>

        {/* User list */}
        <div className={styles['list-user']}>
          {users.map((user) => (
            <Link
              to={`/admin/user/${user.user_id}`}
              key={user.user_id}
              className={styles['nav-link']}
              >
              <ListItem
                userName={user.user_name}
                email={user.email}
                role={user.role_id === 1 ? 'Admin' : 'User'}
                status={user.status}
                styles={styles}
              />
            </Link>
          ))}
        </div>
    </div>
  );
}
export default ListUser;

function ListItem({ userName, email, role, status, styles }) {
  const statusKey = status === 'Active' ? 'active' : 'banned';
  const statusClass = `${styles.status} ${styles[statusKey]}`;

  return (
    <div className={styles['user-item']}>
      <div className="name"><li>{userName}</li></div>
      <div className="email"><li>{email}</li></div>
      <div className="role"><li>{role}</li></div>
      <div className={statusClass}><li>{status}</li></div>
    </div>
  );
}
