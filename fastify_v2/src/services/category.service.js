const getAll = async (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM category WHERE isDelete = 0', (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result); // 🛠 FIXED: Giờ đây Promise sẽ trả về dữ liệu
    });
  });
};
const getAllIsDelete = async (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM category WHERE isDelete = 1', (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result); // 🛠 FIXED: Giờ đây Promise sẽ trả về dữ liệu
    });
  });
};
const getOne = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM category WHERE id = ?', [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result.length === 0) {  // Kiểm tra nếu không có dữ liệu
        resolve(null);
        return;
      }
      resolve(result[0]);  // Trả về phần tử đầu tiên nếu có dữ liệu
    });
  });
};
const createCategory = async (db, name) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM category WHERE LOWER(name) = LOWER(?)', [name], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0) {
        // Nếu đã tồn tại brand
        reject(new Error('category already exists'));
        return;
      }

      // Nếu chưa có thì insert
      db.query('INSERT INTO category (name) VALUES (?)', [name], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: result.insertId, name });
      });
    });
  });
};
const updateCategory = async (db, id, name) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra xem brand đã tồn tại (không phân biệt hoa thường)
    db.query('SELECT * FROM category WHERE LOWER(name) = LOWER(?)', [name], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0 && results[0].id != id) {
        // Nếu đã có brand khác với id hiện tại, báo lỗi
        reject(new Error('category already exists'));
        return;
      }

      // Nếu không trùng thì thực hiện UPDATE
      db.query('UPDATE category SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        if (result.affectedRows === 0) {
          resolve(null); // Không tìm thấy brand để update
          return;
        }

        resolve({ id, name });
      });
    });
  });
};

const deleteCategory = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM category WHERE id = ?', [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result.affectedRows === 0) {
        resolve(null);
        return;
      }
      resolve({ message: 'category deleted successfully' });
    });
  });
};
const softDelete = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE category SET isDelete = 1 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Soft Delete Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};
const restore = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE category SET isDelete = 0 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Soft Delete Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};
module.exports = {
  getAll,
  getOne,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllIsDelete,
  softDelete,
  restore
};
