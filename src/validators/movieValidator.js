const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/**
 * Kiểm tra năm phát hành hợp lệ.
 */
export const validateYear = (year) => {
    const num = parseInt(year);
    if (isNaN(num) || num < MIN_YEAR || num > MAX_YEAR) {
        return `Năm phát hành không hợp lệ (phải từ ${MIN_YEAR} đến ${MAX_YEAR})!`;
    }
    return null;
};

/**
 * Kiểm tra thời lượng phim hợp lệ.
 */
export const validateDuration = (duration) => {
    const num = parseInt(duration);
    if (isNaN(num) || num <= 0) {
        return 'Thời lượng phải là số dương (phút)!';
    }
    return null;
};

/**
 * Validate toàn bộ form phim (dùng cho AddMovie và EditMovie).
 */
export const validateMovieForm = ({
    title,
    description,
    release_year,
    duration,
    selectedCategories,
    image = null,
    background = null,
    isEditMode = false,
}) => {
    if (!title || !title.trim()) {
        return { valid: false, message: 'Tên phim không được để trống!' };
    }
    if (!description || !description.trim()) {
        return { valid: false, message: 'Mô tả không được để trống!' };
    }
    if (!selectedCategories || selectedCategories.length === 0) {
        return { valid: false, message: 'Vui lòng chọn ít nhất một thể loại!' };
    }

    const yearError = validateYear(release_year);
    if (yearError) return { valid: false, message: yearError };

    const durationError = validateDuration(duration);
    if (durationError) return { valid: false, message: durationError };

    // Chỉ bắt buộc upload ảnh khi thêm mới (không phải sửa)
    if (!isEditMode) {
        if (!image || !background) {
            return { valid: false, message: 'Vui lòng tải lên đủ ảnh poster và ảnh nền!' };
        }
    }

    return { valid: true, message: null };
};
