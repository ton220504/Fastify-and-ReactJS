const fs = require('fs');
const path = require('path');
const util = require('util');
const pump = util.promisify(require('stream').pipeline);

const uploadDir = path.join(__dirname, '../uploads'); // Đường dẫn thư mục lưu file
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa có
}

async function uploadFile(req, res) {
    try {
        const data = await req.file(); // Lấy file từ request

        if (!data || !data.filename) {
            return res.status(400).send({ message: 'No file uploaded or file name is missing!' });
        }

        const filename = data.filename.replace(/\s+/g, '-'); // Xóa khoảng trắng trong tên file
        const filePath = path.join(uploadDir, filename);
        const fileUrl = `${process.env.HOST || 'http://localhost:3000'}/uploads/${filename}`;

        // Lưu file vào thư mục
        await pump(data.file, fs.createWriteStream(filePath));

        // Trả về thông tin file
        res.send({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: filename
        });

    } catch (err) {
        console.error("🚨 Upload error:", err);
        res.status(500).send({ error: 'Upload failed', details: err.message });
    }
}

module.exports = { uploadFile };
