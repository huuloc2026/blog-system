import { Response } from 'express';

/**
 * Gửi Refresh Token dưới dạng cookie HTTP-Only
 * @param res - Đối tượng Response từ Express
 * @param token - Refresh Token cần gửi
 */
export const sendRefreshToken = (res: Response, token: string) => {
    const maxAge = Number(process.env.SEND_REFRESH_TOKEN)
    res.cookie('refreshToken', token, {
        httpOnly: true, 
        secure: false, //|| process.env.NODE_ENV === 'production', 
        sameSite: 'strict', // Ngăn chặn CSRF
        path: '/', // Chỉ gửi cookie này tới endpoint làm mới token
        maxAge: maxAge,
    });
};
