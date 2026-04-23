import React from "react";

const ReviewSection = ({ reviews, newComment, setNewComment, onReviewSubmit, styles }) => {
    return (
        <div className={styles['review-section']}>
            <div className={styles['review-header']}>
                <h3>Bình luận ({reviews.length})</h3>
                <span className={styles['refresh-icon']}>↻</span>
            </div>
            
            <form onSubmit={onReviewSubmit} className={styles['comment-form']}>
                <textarea
                    placeholder="Nhập bình luận của bạn tại đây"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                ></textarea>
                <div className={styles['comment-actions']}>
                    <div className="action-left">
                    </div>
                    <button type="submit" className={styles['submit-comment-btn']}>Gửi</button>
                </div>
            </form>

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={`review-${index}`} className={styles['review-item']}>
                            <div className={styles['review-avatar']}>
                                <img src={review.avatar_url || "/images/default-avatar.png"} alt="Avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + review.user_name + '&background=random' }} />
                                <div className={styles['user-level']}>Lv 12</div>
                            </div>
                            <div className={styles['review-content']}>
                                <div className={styles['review-user']}>
                                    <strong>{review.user_name}</strong> 
                                </div>
                                <p className={styles['review-text']}>{review.comment}</p>
                                <div className={styles['review-time']}>
                                    <span className={styles['reply-btn']}>Trả lời</span> {new Date(review.review_date).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles['text-muted']} style={{color: '#999'}}>Chưa có đánh giá nào.</p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
