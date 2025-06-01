const createWishlist = (db, user_id, product_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM wishlist WHERE user_id = ?', [user_id], (err, wishlistRows) => {
      if (err) return reject(err);

      let wishlist_id;

      if (wishlistRows.length === 0) {
        // Nếu chưa có wishlist → tạo mới
        db.query('INSERT INTO wishlist (user_id) VALUES (?)', [user_id], (err, insertResult) => {
          if (err) return reject(err);
          wishlist_id = insertResult.insertId;
          insertItem();
        });
      } else {
        wishlist_id = wishlistRows[0].id;
        insertItem();
      }

      function insertItem() {
        // Check trùng sản phẩm
        db.query(
          'SELECT * FROM wishlist_item WHERE wishlist_id = ? AND product_id = ?',
          [wishlist_id, product_id],
          (err, existRows) => {
            if (err) return reject(err);
            if (existRows.length > 0) {
              return resolve({ message: 'Product already in wishlist' });
            }

            db.query(
              'INSERT INTO wishlist_item (product_id, wishlist_id) VALUES (?, ?)',
              [product_id, wishlist_id],
              (err) => {
                if (err) return reject(err);
                resolve({ message: 'Product added to wishlist' });
              }
            );
          }
        );
      }
    });
  });
};

const getAllWishlists = (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM wishlist', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getWishlistByUser = (db, user_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM wishlist WHERE user_id = ?', [user_id], (err, wishlistRows) => {
      if (err) return reject(err);
      if (wishlistRows.length === 0) return resolve(null);

      const wishlist = wishlistRows[0];

      db.query('SELECT * FROM wishlist_item WHERE wishlist_id = ?', [wishlist.id], (err, itemRows) => {
        if (err) return reject(err);
        resolve({
          ...wishlist,
          items: itemRows
        });
      });
    });
  });
};

const removeWishlistItem = (db, wishlist_item_id) => {
  return new Promise((resolve, reject) => {
    // 1. Lấy thông tin wishlist_id từ wishlist_item
    db.query('SELECT wishlist_id FROM wishlist_item WHERE id = ?', [wishlist_item_id], (err, [item]) => {
      if (err) return reject(err);
      if (!item) return reject(new Error('Wishlist item not found'));

      const wishlist_id = item.wishlist_id;

      // 2. Đếm số lượng wishlist_item trong wishlist đó
      db.query('SELECT COUNT(*) AS count FROM wishlist_item WHERE wishlist_id = ?', [wishlist_id], (err, [countRow]) => {
        if (err) return reject(err);

        const itemCount = countRow.count;

        if (itemCount > 1) {
          // ➕ Còn nhiều sản phẩm → chỉ xóa item
          db.query('DELETE FROM wishlist_item WHERE id = ?', [wishlist_item_id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Wishlist item removed' });
          });
        } else {
          // 🧨 Chỉ còn 1 sản phẩm → xóa cả item và wishlist
          db.query('DELETE FROM wishlist_item WHERE id = ?', [wishlist_item_id], (err) => {
            if (err) return reject(err);

            db.query('DELETE FROM wishlist WHERE id = ?', [wishlist_id], (err) => {
              if (err) return reject(err);
              resolve({ message: 'Wishlist item and wishlist removed' });
            });
          });
        }
      });
    });
  });
};
const countWishlistByUserId = (db, user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(wi.id) AS count
      FROM wishlist_item wi
      JOIN wishlist w ON wi.wishlist_id = w.id
      WHERE w.user_id = ?
    `;
    db.query(query, [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // { count: x }
    });
  });
};

module.exports = {
  createWishlist,
  getAllWishlists,
  getWishlistByUser,
  removeWishlistItem,
  countWishlistByUserId
};
