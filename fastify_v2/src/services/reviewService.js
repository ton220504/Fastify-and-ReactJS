// services/ReviewService.js
const createReview = async (db, { content, product_id, user_id }) => {
  return new Promise((resolve, reject) => {
    const created_at = new Date();
    db.query(
      `INSERT INTO reviews (content, product_id, user_id, created_at) VALUES (?, ?, ?, ?)`,
      [content, product_id, user_id, created_at],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, content, product_id, user_id, created_at });
      }
    );
  });
};

const deleteReview = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM reviews WHERE id = ?`, [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return reject(new Error("Review not found"));
      resolve({ message: 'Review deleted successfully' });
    });
  });
};

// const getAllReviews = async (db) => {
//   return new Promise((resolve, reject) => {
//     db.query(`SELECT * FROM reviews ORDER BY created_at DESC`, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };
const getAllReviews = async (db) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        r.id AS review_id,
        r.content,
        r.created_at,
        u.id AS user_id,
        u.username,
        u.email,
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.image AS product_image
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN product p ON r.product_id = p.id
      ORDER BY r.created_at DESC
      `,
      (err, results) => {
        if (err) return reject(err);

        const reviews = results.map(row => ({
          id: row.review_id,
          content: row.content,
          created_at: row.created_at,
          user: {
            id: row.user_id,
            username: row.username,
            email: row.email,
          },
          product: {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            image: row.product_image,
          },
        }));

        resolve(reviews);
      }
    );
  });
};


const getReviewsByUserId = async (db, userId) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
// services/reviewService.js
const getReviewsByProductId = async (db, productId) => {
  return new Promise((resolve, reject) => {
    const sql = `
          SELECT 
              r.id, 
              r.content, 
              r.product_id, 
              r.user_id, 
              r.created_at,
              u.username AS username,
              u.email AS email
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.product_id = ?
          ORDER BY r.created_at DESC
      `;

    db.query(sql, [productId], (err, results) => {
      if (err) {
        console.error("❌ Lỗi lấy đánh giá có thông tin user:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const updateReview = async (db, id, { content }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE reviews SET content = ? WHERE id = ?`,
      [content, id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id, content });
      }
    );
  });
};
const getOneReview = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT 
        r.id AS review_id,
        r.content,
        r.created_at,
        u.id AS user_id,
        u.username,
        u.email,
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.image AS product_image
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN product p ON r.product_id = p.id
      WHERE r.id = ?
      `,
      [id],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);

        const row = results[0];
        const review = {
          id: row.review_id,
          content: row.content,
          created_at: row.created_at,
          user: {
            id: row.user_id,
            username: row.username,
            email: row.email,
          },
          product: {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            image: row.product_image,
          },
        };
        resolve(review);
      }
    );
  });
};
const getReviewsByProductName = async (db, productName) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        r.id,
        r.content,
        r.product_id,
        r.user_id,
        r.created_at,
        u.username,
        u.email,
        p.name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN product p ON r.product_id = p.id
      WHERE p.name LIKE ?
      ORDER BY r.created_at DESC
    `;

    db.query(sql, [`%${productName}%`], (err, results) => {
      if (err) {
        console.error("❌ Lỗi lấy đánh giá theo tên sản phẩm:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  getReviewsByProductId,
  getReviewsByProductName,
};




module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByUserId,
  getReviewsByProductId,
  updateReview,
  getOneReview,
  getReviewsByProductName
};
