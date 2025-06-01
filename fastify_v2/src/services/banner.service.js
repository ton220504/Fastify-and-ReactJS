const getAllBanners = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM banner WHERE isDelete = 0", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getAllBannersIsDelete = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM banner WHERE isDelete = 1", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getOneBanner = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM banner WHERE id = ?", [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};

const createBanner = async (db, banner) => {
    const { name, image } = banner;

    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO banner (name, image) VALUES (?, ?)",
            [name, image],
            (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, ...banner });
            }
        );
    });
};

const updateBanner = async (db, id, banner) => {
    const { name, image } = banner;

    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE banner SET name = ?, image = ? WHERE id = ?",
            [name, image, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const deleteBanner = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM banner WHERE id = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
const softDelete = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE banner SET isDelete = 1 WHERE id = ?",
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
      "UPDATE banner SET isDelete = 0 WHERE id = ?",
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
    getAllBanners,
    getOneBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    getAllBannersIsDelete,
    softDelete,
    restore
};
