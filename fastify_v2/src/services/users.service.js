const createUser = async (db, { role, username, password, address, phone, email, created_at }) => {
    return new Promise((resolve, reject) => {
        try {
            //const createdAt = Date.now();
            db.query(
                'INSERT INTO users (role, username, password, address, phone, email, created_at) VALUES (?, ?, ?, ?, ?, ?,?)',
                [role, username, password, address, phone, email, created_at],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                }
            );
        } catch (error) {
            console.error("Database error: ", error);
            reject(error);
        }
    });
};
const getOne = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id, role, username, email, address, phone, password FROM users WHERE id = ?',
            [id],
            (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (results.length === 0) {
                    resolve(null); // Trả về null nếu không tìm thấy user
                } else {
                    resolve(results[0]);
                }
            }
        );
    });
};
const login = async (db, { email }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.length === 0) {
                    resolve(null);
                    return;
                }
                resolve(result[0]);
            }
        );
    });
};
const getAll = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
// const updateUser = async (db, id, { role, username, password, email, address, phone }) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             `UPDATE users SET role = ?, username = ?, password = ?, email = ?, address = ?, phone = ? WHERE id = ?`,
//             [role, username, password, email, address, phone, id],
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//             }
//         );
//     });
// };
const updateUser = async (db, id, data) => {
    const fields = [];
    const values = [];

    for (const key in data) {
        if (data[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    if (fields.length === 0) {
        throw new Error("Không có dữ liệu để cập nhật.");
    }

    values.push(id); // Thêm id cuối cùng cho WHERE
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Xóa user
const deleteUser = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
async function findUserByEmail(db, email) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
}
async function createUserGG(db, user) {
    const { username, email, role, created_at } = user;
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO users (username, email, role,created_at) VALUES (?, ?, ?,?)",
            [username, email, role, created_at],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            }
        );
    });
}
async function saveOtp(db, email, otp) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO password_reset_tokens (email, otp, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt],
            (err, result) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

async function verifyOtp(db, email, otp) {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM password_reset_tokens WHERE email = ? AND otp = ? AND expires_at > NOW()",
            [email, otp],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0);
            }
        );
    });
}

async function updatePassword(db, email, newPassword) {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [newPassword, email],
            (err, result) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}
const updatePasswordById = async (db, id, newHashedPassword) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET password = ? WHERE id = ?";
        db.query(sql, [newHashedPassword, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getPasswordById = async (db, id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT password FROM users WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("User not found"));
            resolve(results[0].password);
        });
    });
};
module.exports = {
    createUser,
    getOne,
    login,
    getAll,
    updateUser,
    deleteUser,
    findUserByEmail,
    createUserGG,
    saveOtp,
    verifyOtp,
    updatePassword,
    updatePasswordById,
    getPasswordById
}