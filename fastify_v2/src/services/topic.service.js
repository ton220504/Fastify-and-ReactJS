const getAllTopics = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM topic WHERE isDelete = 0", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getAllTopicsIsDelete = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM topic WHERE isDelete = 1", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getOneTopic = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM topic WHERE id = ?", [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};

const createTopic = async (db, topic) => {
    const { name, slug, description, sort_order, status, created_by } = topic;

    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO topic (name, slug, description, sort_order, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [name, slug, description, sort_order, status, created_by],
            (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, ...topic });
            }
        );
    });
};

const updateTopic = async (db, id, topic) => {
    const { name, slug, description, sort_order, status } = topic;

    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE topic SET name = ?, slug = ?, description = ?, sort_order = ?, status = ? WHERE id = ?",
            [name, slug, description, sort_order, status, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const deleteTopic = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM topic WHERE id = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
const softDelete = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE topic SET isDelete = 1 WHERE id = ?",
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
      "UPDATE topic SET isDelete = 0 WHERE id = ?",
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
    getAllTopics,
    getOneTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    getAllTopicsIsDelete,
    softDelete,
    restore
};
