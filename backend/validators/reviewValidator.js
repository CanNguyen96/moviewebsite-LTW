const MAX_COMMENT_LENGTH = 1000;

/**
 * Kiểm tra nội dung bình luận hợp lệ.
 */
const validateComment = (comment) => {
    if (!comment) {
        return { valid: false, message: 'Vui lòng nhập nội dung bình luận!' };
    }
    if (!comment.trim()) {
        return { valid: false, message: 'Bình luận không được chỉ chứa khoảng trắng!' };
    }
    if (comment.length > MAX_COMMENT_LENGTH) {
        return {
            valid: false,
            message: `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự!`,
        };
    }
    return { valid: true, message: null };
};

module.exports = {
    validateComment,
    MAX_COMMENT_LENGTH,
};
