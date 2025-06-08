
const createCart = async (db, { user_id, items }) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM cart WHERE user_id = ?', [user_id], async (err, cartRows) => {
      if (err) return reject(err);
      let cart_id;
      let total_price = 0;
      if (cartRows.length === 0) {
        // Chưa có cart, tạo mới
        total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        db.query('INSERT INTO cart (user_id, total_price) VALUES (?, ?)', [user_id, total_price], (err, cartResult) => {
          if (err) return reject(err);
          cart_id = cartResult.insertId;
          insertItems(cart_id);
        });
      } else {
        // Đã có cart
        cart_id = cartRows[0].id;
        const insertOrUpdatePromises = items.map(item => {
          return new Promise((resolveItem, rejectItem) => {
            const { product_id, quantity, price, image, color } = item;
            db.query('SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ? AND color = ? AND price = ?', [cart_id, product_id, color, price], (err, itemRows) => {
              if (err) return rejectItem(err);
              if (itemRows.length > 0) {
                const existingItem = itemRows[0];
                const newQuantity = existingItem.quantity + quantity;
                const newTotal = newQuantity * price;
                db.query('UPDATE cart_item SET quantity = ?, total_price = ? WHERE id = ?', [newQuantity, newTotal, existingItem.id], (err) => {
                  if (err) return rejectItem(err);
                  resolveItem();
                });
              } else {
                const totalPrice = price * quantity;
                db.query('INSERT INTO cart_item (product_id, price, quantity, total_price, cart_id, image, color) VALUES (?, ?, ?, ?, ?,?,?)', [product_id, price, quantity, totalPrice, cart_id, image?.split('/').pop(), color], (err) => {
                  if (err) return rejectItem(err);
                  resolveItem();
                });
              }
            });
          });
        });
        try {
          await Promise.all(insertOrUpdatePromises);
          updateCartTotalPrice(cart_id); // Chỉ gọi 1 lần
        } catch (err) {
          return reject(err);
        }
      }
      function insertItems(cart_id) {
        const values = items.map(item => [
          item.product_id,
          item.price,
          item.quantity,
          item.price * item.quantity,
          cart_id,
          item.image?.split('/').pop(),
          item.color
        ]);
        db.query('INSERT INTO cart_item (product_id, price, quantity, total_price, cart_id,image, color) VALUES ?', [values], (err) => {
          if (err) return reject(err);
          updateCartTotalPrice(cart_id);
        });
      }
      function updateCartTotalPrice(cart_id) {
        db.query('SELECT SUM(total_price) AS total FROM cart_item WHERE cart_id = ?', [cart_id], (err, [result]) => {
          if (err) return reject(err);

          const newTotalPrice = result.total || 0;

          db.query('UPDATE cart SET total_price = ? WHERE id = ?', [newTotalPrice, cart_id], (err) => {
            if (err) return reject(err);

            // 🔁 Truy vấn lại các item trong giỏ hàng
            db.query('SELECT product_id, quantity, price, total_price, image, color FROM cart_item WHERE cart_id = ?', [cart_id], (err, items) => {
              if (err) return reject(err);

              resolve({
                id: cart_id,
                user_id,
                total_price: newTotalPrice,
                items 
              });
            });
          });
        });
      }

    });
  });
};

const updateQuantity = (db, { cart_item_id, quantity }) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT price, cart_id FROM cart_item WHERE id = ?', [cart_item_id], (err, [item]) => {
      if (err || !item) return reject(err || new Error('Item not found'));

      const total_price = item.price * quantity;

      db.query('UPDATE cart_item SET quantity = ?, total_price = ? WHERE id = ?', [quantity, total_price, cart_item_id], (err) => {
        if (err) return reject(err);

        // Cập nhật lại tổng cart
        db.query('SELECT SUM(total_price) as total FROM cart_item WHERE cart_id = ?', [item.cart_id], (err, [sum]) => {
          if (err) return reject(err);

          db.query('UPDATE cart SET total_price = ? WHERE id = ?', [sum.total, item.cart_id], (err) => {
            if (err) return reject(err);
            resolve({ message: 'Quantity updated successfully' });
          });
        });
      });
    });
  });
};

const deleteCart = (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM cart_item WHERE cart_id = ?', [id], (err) => {
      if (err) return reject(err);
      db.query('DELETE FROM cart WHERE id = ?', [id], (err) => {
        if (err) return reject(err);
        resolve({ message: 'Cart deleted' });
      });
    });
  });
};

const getAllCarts = (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM cart', (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getCartByUserId = (db, user_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM cart WHERE user_id = ?', [user_id], (err, [cart]) => {
      if (err) return reject(err);
      if (!cart) return resolve(null);

      db.query('SELECT * FROM cart_item WHERE cart_id = ?', [cart.id], (err, items) => {
        if (err) return reject(err);
        resolve({ ...cart, items });
      });
    });
  });
};

const countCartItemsByUserId = (db, user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT SUM(ci.quantity) AS count
      FROM cart_item ci
      INNER JOIN cart c ON ci.cart_id = c.id
      WHERE c.user_id = ?
    `;
    db.query(query, [user_id], (err, result) => {
      if (err) return reject(err);
      resolve({ count: result[0].count || 0 }); // Trả về 0 nếu null
    });
  });
};

const removeCart = (db, cart_item_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT cart_id, price, quantity FROM cart_item WHERE id = ?', [cart_item_id], (err, [item]) => {
      if (err) return reject(err);
      if (!item) return reject(new Error('Cart item not found'));

      const { cart_id, price, quantity } = item;
      const totalItemPrice = price * quantity;

      db.query('SELECT COUNT(*) AS count FROM cart_item WHERE cart_id = ?', [cart_id], (err, [countRow]) => {
        if (err) return reject(err);

        const itemCount = countRow.count;

        if (itemCount > 1) {
          db.query('DELETE FROM cart_item WHERE id = ?', [cart_item_id], (err) => {
            if (err) return reject(err);

            db.query(
              'UPDATE cart SET total_price = IFNULL(total_price, 0) - ? WHERE id = ?',
              [totalItemPrice, cart_id],
              (err) => {
                if (err) return reject(err);
                resolve({ message: 'Cart item removed and total_price updated' });
              }
            );
          });
        } else {
          db.query('DELETE FROM cart_item WHERE id = ?', [cart_item_id], (err) => {
            if (err) return reject(err);

            db.query('DELETE FROM cart WHERE id = ?', [cart_id], (err) => {
              if (err) return reject(err);
              resolve({ message: 'Cart item and cart removed' });
            });
          });
        }
      });
    });
  });
};





module.exports = {
  createCart,
  updateQuantity,
  deleteCart,
  getAllCarts,
  getCartByUserId,
  countCartItemsByUserId,
  removeCart
};
