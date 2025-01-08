export const HelpParseJSON = (data:any) => {
    return data.map((item:any) => {
        try {
            // Parse JSON, đảm bảo xử lý cả object và array
            return JSON.parse(item);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null; // Xử lý lỗi nếu cần
        }
    });
};
