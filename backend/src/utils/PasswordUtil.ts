import bcrypt from 'bcrypt';

/**
 * Hàm để mã hóa mật khẩu
 * @param password Mật khẩu chưa mã hóa
 * @returns Promise<string> Mật khẩu đã mã hóa
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Số vòng salt, càng cao càng an toàn nhưng lâu hơn
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Mã hóa mật khẩu
    return hashedPassword;
};

/**
 * Hàm để xác minh mật khẩu
 * @param password Mật khẩu chưa mã hóa
 * @param hashedPassword Mật khẩu đã mã hóa
 * @returns Promise<boolean> Kết quả so sánh
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword); // Kiểm tra mật khẩu
    return isMatch;
};
