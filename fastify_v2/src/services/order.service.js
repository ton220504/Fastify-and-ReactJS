
// const getAllOrders = async (db) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             `SELECT o.*, a.district, a.province, a.street, a.ward
//              FROM orders o 
//              JOIN addresses a ON o.address_id = a.id`,
//             (err, orders) => {
//                 if (err) return reject(err);

//                 // Lặp qua từng đơn hàng và thêm các items cho mỗi đơn hàng
//                 const orderPromises = orders.map((order) => {
//                     return new Promise((resolveItem, rejectItem) => {
//                         db.query(
//                             `SELECT * FROM order_items WHERE order_id = ?`,
//                             [order.id],
//                             (err, items) => {
//                                 if (err) return rejectItem(err);

//                                 order.items = items;
//                                 order.address = {
//                                     district: order.district,
//                                     province: order.province,
//                                     street: order.street,
//                                     ward: order.ward
//                                 };

//                                 // Xóa các trường tạm thời trong order
//                                 delete order.district;
//                                 delete order.province;
//                                 delete order.street;
//                                 delete order.ward;

//                                 resolveItem(order);  // Resolve với order đã đầy đủ
//                             }
//                         );
//                     });
//                 });

//                 // Đợi tất cả promises hoàn thành
//                 Promise.all(orderPromises)
//                     .then((ordersWithItems) => resolve(ordersWithItems))
//                     .catch(reject);  // Xử lý nếu có lỗi trong bất kỳ promise nào
//             }
//         );
//     });
// };
const getAllOrders = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                o.*, 
                a.district, a.province, a.street, a.ward,
                u.id AS user_id, u.username AS user_name, u.email AS user_email
             FROM orders o
             JOIN addresses a ON o.address_id = a.id
             JOIN users u ON o.user_id = u.id`,
            (err, orders) => {
                if (err) return reject(err);

                const orderPromises = orders.map((order) => {
                    return new Promise((resolveItem, rejectItem) => {
                        db.query(
                            `SELECT * FROM order_items WHERE order_id = ?`,
                            [order.id],
                            (err, items) => {
                                if (err) return rejectItem(err);

                                // Gắn items vào order
                                order.items = items;

                                // Gắn address
                                order.address = {
                                    district: order.district,
                                    province: order.province,
                                    street: order.street,
                                    ward: order.ward
                                };

                                // Gắn thông tin user
                                order.user = {
                                    id: order.user_id,
                                    name: order.user_name,
                                    email: order.user_email
                                };

                                // Xóa trường dư thừa
                                delete order.district;
                                delete order.province;
                                delete order.street;
                                delete order.ward;
                                delete order.user_name;
                                delete order.user_email;

                                resolveItem(order);
                            }
                        );
                    });
                });

                Promise.all(orderPromises)
                    .then((ordersWithItems) => resolve(ordersWithItems))
                    .catch(reject);
            }
        );
    });
};
const getOrdersByUserId = async (db, userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT o.*, a.district, a.province, a.street, a.ward
         FROM orders o 
         JOIN addresses a ON o.address_id = a.id
         WHERE o.user_id = ?`,
            [userId],
            (err, orders) => {
                if (err) return reject(err);

                const orderPromises = orders.map((order) => {
                    return new Promise((resolveItem, rejectItem) => {
                        db.query(
                            `SELECT * FROM order_items WHERE order_id = ?`,
                            [order.id],
                            (err, items) => {
                                if (err) return rejectItem(err);

                                order.items = items;
                                order.address = {
                                    district: order.district,
                                    province: order.province,
                                    street: order.street,
                                    ward: order.ward
                                };

                                // Xóa các trường tạm thời
                                delete order.district;
                                delete order.province;
                                delete order.street;
                                delete order.ward;

                                resolveItem(order);
                            }
                        );
                    });
                });

                Promise.all(orderPromises)
                    .then((ordersWithItems) => resolve(ordersWithItems))
                    .catch(reject);
            }
        );
    });
};

// Tạo mới order (transaction)
const createOrder = async (db, { address, items, ...orderData }) => {
    const { district, province, street, ward } = address;
    const { user_id, total_price, status, payment_method } = orderData;

    return new Promise((resolve, reject) => {
        // 1. Thêm địa chỉ
        db.query(
            'INSERT INTO addresses (district, province, street, ward) VALUES (?, ?, ?, ?)',
            [district, province, street, ward],
            (err, addressResult) => {
                if (err) return reject(err);

                const address_id = addressResult.insertId;

                // 2. Thêm order
                db.query(
                    'INSERT INTO orders (user_id, total_price, status, payment_method, address_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                    [user_id, total_price, status.toLowerCase(), payment_method.toLowerCase(), address_id],
                    (err, orderResult) => {
                        if (err) return reject(err);

                        const order_id = orderResult.insertId;

                        // 3. Thêm order items
                        const values = items.map(item => [item.product_id, item.price, item.quantity, order_id,item.image?.split('/').pop()]);
                        db.query(
                            'INSERT INTO order_items (product_id, price, quantity, order_id, image) VALUES ?',
                            [values],
                            (err) => {
                                if (err) return reject(err);

                                // ✅ Trả về dữ liệu order cơ bản sau khi insert
                                resolve({
                                    id: order_id,
                                    user_id,
                                    total_price,
                                    status,
                                    payment_method,
                                    address: { id: address_id, district, province, street, ward },
                                    items
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

// Cập nhật order (ví dụ cơ bản)
const updateOrder = async (db, id, data) => {
    const result = await db.query('UPDATE orders SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0 ? this.getOrderById(db, id) : null;
}

// Xóa order
const deleteOrder = async (db, id) => {
    return new Promise((resolve, reject) => {
        // Bước 1: Xóa các order_items liên quan trước
        db.query('DELETE FROM order_items WHERE order_id = ?', [id], (err) => {
            if (err) return reject(err);

            // Bước 2: Lấy address_id từ đơn hàng cần xóa
            db.query('SELECT address_id FROM orders WHERE id = ?', [id], (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return reject(new Error('Order not found'));

                const addressId = result[0].address_id;

                // Bước 3: Xóa đơn hàng
                db.query('DELETE FROM orders WHERE id = ?', [id], (err) => {
                    if (err) return reject(err);

                    // Bước 4: Xóa địa chỉ liên quan
                    db.query('DELETE FROM addresses WHERE id = ?', [addressId], (err) => {
                        if (err) return reject(err);

                        resolve({ message: 'Order deleted successfully' });
                    });
                });
            });
        });
    });
};
const getOrderById = async (db, orderId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT o.*, a.district, a.province, a.street, a.ward, u.username as user_name, u.email as user_email, u.phone as phone
             FROM orders o
             JOIN addresses a ON o.address_id = a.id
             JOIN users u ON o.user_id = u.id
             WHERE o.id = ?`,
            [orderId],
            (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);

                const order = results[0];
                order.address = {
                    district: order.district,
                    province: order.province,
                    street: order.street,
                    ward: order.ward
                };
                order.user = {
                    id: order.user_id,
                    name: order.user_name,
                    email: order.user_email,
                    phone: order.phone
                };

                delete order.district;
                delete order.province;
                delete order.street;
                delete order.ward;
                delete order.user_name;
                delete order.user_email;

                // Lấy order_items + product
                db.query(
                    `SELECT oi.*, p.name AS product_name, p.price AS product_price, p.image AS product_image
                     FROM order_items oi
                     JOIN product p ON oi.product_id = p.id
                     WHERE oi.order_id = ?`,
                    [orderId],
                    (err, items) => {
                        if (err) return reject(err);

                        order.items = items.map((item) => ({
                            ...item,
                            product: {
                                id: item.product_id,
                                name: item.product_name,
                                price: item.product_price,
                                image: item.product_image
                            }
                        }));

                        resolve(order);
                    }
                );
            }
        );
    });
};

const updateOrderStatus = (db, id, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};


module.exports = {
    getAllOrders,
    getOrdersByUserId,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    updateOrderStatus
};