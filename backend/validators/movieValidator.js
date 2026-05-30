const VALID_STATUSES = ['Approved', 'Pending'];
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/**
 * Kiểm tra năm phát hành hợp lệ.
 */
const validateYear = (year) => {
    const num = parseInt(year);
    if (isNaN(num) || num < MIN_YEAR || num > MAX_YEAR) {
        return {
            valid: false,
            message: `Năm phát hành không hợp lệ (phải từ ${MIN_YEAR} đến ${MAX_YEAR}).`,
        };
    }
    return { valid: true, message: null };
};

/**
 * Kiểm tra thời lượng phim hợp lệ.
 */
const validateDuration = (duration) => {
    const num = parseInt(duration);
    if (isNaN(num) || num <= 0) {
        return { valid: false, message: 'Thời lượng phải là số nguyên dương (phút).' };
    }
    return { valid: true, message: null };
};

/**
 * Validate toàn bộ thông tin phim (dùng cho cả thêm mới lẫn cập nhật).
 */
const validateMovieFields = ({ title, description, genre, release_year, duration, status }) => {
    if (!title || !title.trim()) {
        return { valid: false, message: 'Tên phim không được để trống.' };
    }
    if (!description || !description.trim()) {
        return { valid: false, message: 'Mô tả không được để trống.' };
    }
    if (!genre || !genre.trim()) {
        return { valid: false, message: 'Thể loại không được để trống.' };
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return {
            valid: false,
            message: `Trạng thái không hợp lệ (chỉ chấp nhận: ${VALID_STATUSES.join(', ')}).`,
        };
    }

    const yearResult = validateYear(release_year);
    if (!yearResult.valid) return yearResult;

    const durationResult = validateDuration(duration);
    if (!durationResult.valid) return durationResult;

    return { valid: true, message: null };
};

/**
 * Validate thông tin tập phim.
 */
const validateEpisodeFields = ({ episode_number, title, video_url }) => {
    if (!episode_number || !title || !video_url) {
        return { valid: false, message: 'Thiếu thông tin tập phim (episode_number, title, video_url).' };
    }
    const epNum = parseInt(episode_number);
    if (isNaN(epNum) || epNum <= 0) {
        return { valid: false, message: 'Số tập phim phải là số nguyên dương.' };
    }
    return { valid: true, message: null };
};

module.exports = {
    validateYear,
    validateDuration,
    validateMovieFields,
    validateEpisodeFields,
};
