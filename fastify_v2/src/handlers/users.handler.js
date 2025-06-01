const usersService = require('../services/users.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
    const { role, username, password, email, address, phone, created_at } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Nếu client không gửi created_at, thì dùng thời gian hiện tại
    let newCreated_at;
    try {
        newCreated_at = created_at ? new Date(created_at).toISOString() : new Date().toISOString();
    } catch (err) {
        console.error("Invalid created_at format", created_at);
        return res.status(400).send({ error: "created_at không hợp lệ" });
    }

    try {
        const result = await usersService.createUser(this.mysql, {
            role,
            username,
            password: hashedPassword,
            email,
            address,
            phone,
            created_at: newCreated_at
        });

        const id = result.insertId;
        const user = await usersService.getOne(this.mysql, id);
        res.send(user);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: err.message });
    }
}
async function getOne(req, res) {
    try {
        const id = req.params.id;
        const user = await usersService.getOne(req.server.mysql, id);

        if (!user) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.send(user);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usersService.login(this.mysql, { email });
        if (!user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send({ error: 'Unauthoried' });
            return;
        }
        // tao jwt token
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            console.error('JWT_SECRET_KEY is not set in enviroment variables');
            res.status(500).send({ error: 'Internal Server Error' });
            return;
        }
        const token = jwt.sign({ id: user.id, name: user.username }, secretKey, { expiresIn: '2h' });
        const response = {
            jwt: token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                email: user.email,
                role: user.role,
            }
        };
        res.send(response);
    } catch (err) {
        console.error("Database or bcrypt error", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
async function getAll(req, res) {
    try {
        const users = await usersService.getAll(req.server.mysql);
        res.send(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
// Cập nhật user
// async function updateUser(req, res) {
//     const id = req.params.id;
//     const data = req.body;

//     if (!data) {
//         return res.status(400).send({ error: "Missing user data" });
//     }

//     const {
//         role = "user", // 👈 default value
//         username,
//         email,
//         password,
//         address,
//         phone
//     } = data;

//     if (!email || !password) {
//         return res.status(400).send({ error: "Email và mật khẩu là bắt buộc" });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     try {
//         await usersService.updateUser(this.mysql, id, {
//             role,
//             username,
//             email,
//             password: hashedPassword,
//             address,
//             phone
//         });

//         const updatedUser = await usersService.getOne(this.mysql, id);
//         res.send({ message: "Cập nhật thành công", user: updatedUser });
//     } catch (err) {
//         console.error("Update error:", err);
//         res.status(500).send({ error: err.message });
//     }
// }
async function updateUser(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!data) {
        return res.status(400).send({ error: "Missing user data" });
    }

    const {
        role = "user",
        username,
        email,
        password,
        address,
        phone
    } = data;

    if (!email) {
        return res.status(400).send({ error: "Email là bắt buộc" });
    }

    const updateData = {
        role,
        username,
        email,
        address,
        phone
    };

    if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
    }

    try {
        await usersService.updateUser(this.mysql, id, updateData);

        const updatedUser = await usersService.getOne(this.mysql, id);
        res.send({ message: "Cập nhật thành công", user: updatedUser });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send({ error: err.message });
    }
}

// Xóa user
async function deleteUser(req, res) {
    const id = req.params.id;

    try {
        await usersService.deleteUser(this.mysql, id);
        res.send({ message: "Xóa người dùng thành công" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).send({ error: err.message });
    }
}
const changePasswordHandler = async (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).send({ error: "Vui lòng nhập đầy đủ mật khẩu cũ và mới" });
    }

    try {
        // Lấy mật khẩu hiện tại từ DB
        const currentHashed = await usersService.getPasswordById(req.server.mysql, id);

        if (!currentHashed) {
            return res.status(404).send({ error: "Không tìm thấy người dùng hoặc mật khẩu" });
        }

        const isMatch = await bcrypt.compare(oldPassword, currentHashed);
        if (!isMatch) {
            return res.status(400).send({ error: "Mật khẩu cũ không đúng" });
        }

        const newHashed = await bcrypt.hash(newPassword, 10);

        // Gọi service update password theo id
        await usersService.updatePasswordById(req.server.mysql, id, newHashed);

        res.send({ message: "Đổi mật khẩu thành công" });

    } catch (err) {
        console.error("Lỗi đổi mật khẩu:", err);
        res.status(500).send({ error: "Có lỗi xảy ra khi đổi mật khẩu" });
    }
};
const createPasswordHandler = async (req, res) => {
    const id = req.params.id;
    const currentPassword = await usersService.getPasswordById(req.server.mysql, id);
    if (currentPassword) {
        return res.status(400).send({ error: "Tài khoản đã có mật khẩu." });
    }

    const { createPassword } = req.body;

    if (!createPassword) {
        return res.status(400).send({ error: "Vui lòng nhập mật khẩu mới" });
    }

    try {
        const newHashed = await bcrypt.hash(createPassword, 10);
        // Gọi service update password theo id
        await usersService.updatePasswordById(req.server.mysql, id, newHashed);
        res.send({ message: "Tạo mật khẩu thành công" });
    } catch (err) {
        console.error("Lỗi đổi mật khẩu:", err);
        res.status(500).send({ error: "Có lỗi xảy ra khi đổi mật khẩu" });
    }
};

module.exports = {
    createUser,
    getOne,
    login,
    getAll,
    updateUser,
    deleteUser,
    changePasswordHandler,
    createPasswordHandler
}