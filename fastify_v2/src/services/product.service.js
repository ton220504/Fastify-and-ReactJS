const getAllProducts = async (db, page, limit) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS total FROM product WHERE isDelete = 0', (err, countResult) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        'SELECT * FROM product WHERE isDelete = 0 LIMIT ?, ?',
        [(page - 1) * limit, limit],
        (err, products) => {
          if (err) {
            reject(err);
            return;
          }
          if (products.length === 0) {
            resolve({
              data: [], meta: {
                pagination: {
                  page, pageSize:
                    limit, pageCount: 0, total: 0
                }
              }
            })
          }
          const total = countResult[0].total;
          const pageCount = Math.ceil(total / limit);
          resolve({
            data: products,
            meta: {
              pagination: {
                page: parseInt(page, 10),
                pageSize: parseInt(limit, 10),
                pageCount,
                total
              }
            }
          })
        }
      )
    });
  });
};
const getAllProductsIsDelete = async (db, page, limit) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS total FROM product WHERE isDelete = 1', (err, countResult) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        'SELECT * FROM product WHERE isDelete = 1 LIMIT ?, ?',
        [(page - 1) * limit, limit],
        (err, products) => {
          if (err) {
            reject(err);
            return;
          }
          if (products.length === 0) {
            resolve({
              data: [], meta: {
                pagination: {
                  page, pageSize:
                    limit, pageCount: 0, total: 0
                }
              }
            })
          }
          const total = countResult[0].total;
          const pageCount = Math.ceil(total / limit);
          resolve({
            data: products,
            meta: {
              pagination: {
                page: parseInt(page, 10),
                pageSize: parseInt(limit, 10),
                pageCount,
                total
              }
            }
          })
        }
      )
    });
  });
};
const getProductById = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM product WHERE id = ?', [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result.length === 0) {  // ✅ Nếu không có dữ liệu, trả về null
        resolve(null);
        return;
      }
      resolve(result[0]);  // ✅ Trả về sản phẩm đầu tiên (không phải mảng)
    });
  });
};


// const createProduct = async (db, product) => {
//   const { name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete } = product;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `INSERT INTO product 
//       (name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete],
//       (err, result) => {
//         if (err) {
//           console.error("❌ MySQL Insert Error:", err);
//           reject(err);
//           return;
//         }
//         resolve({ id: result.insertId, ...product });
//       }
//     );
//   });
// };
const createProduct = async (db, product) => {
  const { name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete } = product;

  return new Promise((resolve, reject) => {
    // Bước 1: Thêm sản phẩm vào bảng `product`
    db.query(
      `INSERT INTO product 
       (name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Insert Error (product):", err);
          reject(err);
          return;
        }

        const productId = result.insertId;  // Lấy `product_id` của sản phẩm vừa thêm vào

        // Bước 2: Thêm ảnh vào bảng `images`
        db.query(
          `INSERT INTO images (image_url, color_name, price) 
           VALUES (?, ?, ?)`,
          [image, "default", price], // Bạn có thể thay "default" bằng một giá trị mặc định hoặc nhận từ người dùng
          (err2, imageResult) => {
            if (err2) {
              console.error("❌ MySQL Insert Error (images):", err2);
              reject(err2);
              return;
            }

            const imageId = imageResult.insertId;  // Lấy `image_id` từ bảng `images`

            // Bước 3: Thêm liên kết giữa `product_id` và `image_id` vào bảng `product_images` với `sort_order = 0`
            db.query(
              `INSERT INTO product_images (product_id, image_id, sort_order) 
               VALUES (?, ?, ?)`,
              [productId, imageId, 0],  // Chèn vào bảng `product_images` với `sort_order = 0`
              (err3) => {
                if (err3) {
                  console.error("❌ MySQL Insert Error (product_images):", err3);
                  reject(err3);
                  return;
                }

                // Nếu tất cả các bước trên thành công, resolve với dữ liệu trả về
                resolve({
                  id: productId,
                  name,
                  brand,
                  category,
                  price,
                  description,
                  stock_quantity,
                  image_url: image,
                  release_date,
                  product_available,
                  isDelete
                });
              }
            );
          }
        );
      }
    );
  });
};

const getOne = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM product WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0] || null);
      }
    );
  });
};


const updateProduct = async (db, id, product) => {
  const { name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete } = product;

  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE product 
      SET name = ?, brand = ?, category = ?, price = ?, description = ?, stock_quantity = ?, image = ?, release_date = ?, product_available = ?, isDelete = ?
      WHERE id = ?`,
      [name, brand, category, price, description, stock_quantity, image, release_date, product_available, isDelete, id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Update Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};


const deleteProduct = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM product WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Delete Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};
const softDeleteProduct = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE product SET isDelete = 1 WHERE id = ?",
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
      "UPDATE product SET isDelete = 0 WHERE id = ?",
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
const searchProducts = async (db, searchTerm, page, limit) => {
  return new Promise((resolve, reject) => {
    // Tính tổng số sản phẩm tìm được với điều kiện lọc theo searchTerm
    db.query(
      'SELECT COUNT(*) AS total FROM product WHERE name LIKE ?',
      [`%${searchTerm}%`],  // Sử dụng LIKE để tìm kiếm các sản phẩm có tên chứa searchTerm
      (err, countResult) => {
        if (err) {
          reject(err);
          return;
        }

        // Lấy các sản phẩm phù hợp với searchTerm và phân trang
        db.query(
          'SELECT * FROM product WHERE name LIKE ? LIMIT ?, ?',
          [`%${searchTerm}%`, (page - 1) * limit, limit],
          (err, products) => {
            if (err) {
              reject(err);
              return;
            }

            if (products.length === 0) {
              resolve({
                data: [],
                meta: {
                  pagination: {
                    page,
                    pageSize: limit,
                    pageCount: 0,
                    total: 0
                  }
                }
              });
              return;
            }

            const total = countResult[0].total;
            const pageCount = Math.ceil(total / limit);

            resolve({
              data: products,
              meta: {
                pagination: {
                  page: parseInt(page, 10),
                  pageSize: parseInt(limit, 10),
                  pageCount,
                  total
                }
              }
            });
          }
        );
      }
    );
  });
};
// Lấy theo tên brand
// Lấy sản phẩm theo tên brand có phân trang
const getProductsByBrandName = (db, brandName, page, limit) => {
  return new Promise((resolve, reject) => {
    const countSql = `
      SELECT COUNT(*) AS total 
      FROM product 
      WHERE brand = ? AND isDelete = 0
    `;
    db.query(countSql, [brandName], (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;
      const pageCount = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      const sql = `
        SELECT * FROM product 
        WHERE brand = ? AND isDelete = 0
        LIMIT ?, ?
      `;
      db.query(sql, [brandName, offset, limit], (err, products) => {
        if (err) return reject(err);

        resolve({
          data: products,
          meta: {
            pagination: {
              page,
              pageSize: limit,
              pageCount,
              total
            }
          }
        });
      });
    });
  });
};

// Lấy sản phẩm theo tên category có phân trang
const getProductsByCategoryName = (db, categoryName, page, limit) => {
  return new Promise((resolve, reject) => {
    const countSql = `
      SELECT COUNT(*) AS total 
      FROM product 
      WHERE category = ? AND isDelete = 0
    `;
    db.query(countSql, [categoryName], (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;
      const pageCount = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      const sql = `
        SELECT * FROM product 
        WHERE category = ? AND isDelete = 0
        LIMIT ?, ?
      `;
      db.query(sql, [categoryName, offset, limit], (err, products) => {
        if (err) return reject(err);

        resolve({
          data: products,
          meta: {
            pagination: {
              page,
              pageSize: limit,
              pageCount,
              total
            }
          }
        });
      });
    });
  });
};

const getNewestProducts = (db, limit = 5) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM product WHERE isDelete = 0
      ORDER BY release_date DESC
      LIMIT ?
    `;
    db.query(sql, [limit], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
const getNameProducts = (db) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,name FROM product`;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
// const updateStockQuantity = async (db, id, newStock) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       UPDATE product 
//       SET stock_quantity = ?
//       WHERE id = ?
//     `;
//     db.query(sql, [newStock, id], (err, result) => {
//       if (err) {
//         console.error("❌ Lỗi cập nhật số lượng tồn kho:", err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };
const updateStockQuantity = async (db, id, quantityToSubtract) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE product 
      SET stock_quantity = stock_quantity - ?
      WHERE id = ? AND stock_quantity >= ?
    `;
    db.query(sql, [quantityToSubtract, id, quantityToSubtract], (err, result) => {
      if (err) {
        console.error("❌ Lỗi cập nhật số lượng tồn kho:", err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
const getProductImages = async (db, productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT i.image_url, i.color_name, i.price
      FROM product_images pi
      JOIN images i ON pi.image_id = i.id
      WHERE pi.product_id = ?
      ORDER BY pi.sort_order ASC
      `,
      [productId],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        // Format kết quả trước khi trả về
        const formattedImages = results.map(row => ({
          url: row.image_url,
          color: row.color_name,
          price: row.price
        }));

        resolve(formattedImages);
      }
    );
  });
};
const getStock = async (db, productName) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM product WHERE name LIKE ? LIMIT 1"; // Dùng LIKE và giới hạn 1 kết quả
    const likeParam = `%${productName}%`; // Tạo pattern cho LIKE

    db.query(query, [likeParam], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results[0] || null);
    });
  });
};
// const uploadImage = async (db, { image_url, color_name, price }) => {
//   return new Promise((resolve, reject) => {
//     // Thực hiện truy vấn để thêm ảnh vào bảng `images`
//     db.query(
//       `INSERT INTO images (image_url, color_name, price) 
//        VALUES (?, ?, ?)`,
//       [image_url, color_name, price],
//       (err, result) => {
//         if (err) {
//           console.error("❌ MySQL Insert Error:", err);
//           reject(err); // Nếu có lỗi, reject Promise
//           return;
//         }

//         // Thành công, trả về id của ảnh vừa thêm và thông tin ảnh
//         resolve({ id: result.insertId, image_url, color_name, price });
//       }
//     );
//   });
// };
// const uploadImage = async (db, { image_url, color_name, price, product_id, sort_order }) => {
//   return new Promise((resolve, reject) => {
//     // Thực hiện truy vấn để thêm ảnh vào bảng `images`
//     db.query(
//       `INSERT INTO images (image_url, color_name, price) 
//        VALUES (?, ?, ?)`,
//       [image_url, color_name, price],
//       (err, result) => {
//         if (err) {
//           console.error("❌ MySQL Insert Error:", err);
//           reject(err); // Nếu có lỗi, reject Promise
//           return;
//         }

//         // Lấy image_id từ kết quả insert vào bảng images
//         const image_id = result.insertId;

//         // Thực hiện truy vấn để thêm dữ liệu vào bảng `product_images`
//         db.query(
//           `INSERT INTO product_images (product_id, image_id, sort_order) 
//            VALUES (?, ?, ?)`,
//           [product_id, image_id, sort_order],
//           (err2, result2) => {
//             if (err2) {
//               console.error("❌ MySQL Insert Error (product_images):", err2);
//               reject(err2); // Nếu có lỗi trong quá trình insert vào product_images, reject Promise
//               return;
//             }

//             // Thành công, trả về kết quả
//             resolve({ 
//               message: 'Image uploaded and linked to product successfully',
//               image_id,
//               product_id,
//               sort_order
//             });
//           }
//         );
//       }
//     );
//   });
// };
const uploadImage = async (db, { image_url, color_name, price, product_id }) => {
  return new Promise((resolve, reject) => {
    // Bước 1: Thêm ảnh vào bảng `images`
    db.query(
      `INSERT INTO images (image_url, color_name, price) 
       VALUES (?, ?, ?)`,
      [image_url, color_name, price],
      (err, imageResult) => {
        if (err) {
          console.error("❌ MySQL Insert Error (images):", err);
          reject(err);  // Nếu có lỗi, reject Promise
          return;
        }

        // Lấy image_id từ kết quả insert vào bảng images
        const imageId = imageResult.insertId;

        // Bước 2: Tính toán sort_order cho ảnh mới
        db.query(
          `SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?`,
          [product_id],
          (err2, countResult) => {
            if (err2) {
              console.error("❌ MySQL Error (count):", err2);
              reject(err2);
              return;
            }

            const sortOrder = countResult[0].count;  // `sort_order` tiếp theo sẽ là số lượng ảnh hiện tại

            // Bước 3: Thêm ảnh vào bảng `product_images` với sort_order mới
            db.query(
              `INSERT INTO product_images (product_id, image_id, sort_order) 
               VALUES (?, ?, ?)`,
              [product_id, imageId, sortOrder],
              (err3) => {
                if (err3) {
                  console.error("❌ MySQL Insert Error (product_images):", err3);
                  reject(err3);
                  return;
                }

                // Nếu tất cả các bước trên thành công, resolve với kết quả
                resolve({
                  message: 'Image uploaded and linked to product successfully',
                  image_id: imageId,
                  product_id,
                  sort_order: sortOrder
                });
              }
            );
          }
        );
      }
    );
  });
};







module.exports = {
  getAllProducts,
  getOne,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategoryName,
  getProductsByBrandName,
  getNewestProducts,
  updateStockQuantity,
  getProductImages,
  getAllProductsIsDelete,
  softDeleteProduct,
  restore,
  getNameProducts,
  getStock,
  uploadImage
};
