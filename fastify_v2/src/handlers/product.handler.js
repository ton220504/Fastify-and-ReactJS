const productService = require('../services/product.service');

function getAll(req, res) {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const validPage = pageNum ? pageNum : 1;
  const validLimit = limitNum > 0 ? limitNum : 10;

  productService.getAllProducts(this.mysql, validPage, validLimit)
    .then((result) => {
      if (!result || !result.data) {
        res.status(404).send({ error: 'No products found' });
        return;
      }

      const formattedResult = {
        data: result.data.map(product => {
          console.log('Raw image_data:', product.image_data); // Debug xem có dữ liệu không

          return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            description: product.description,
            stockQuantity: product.stock_quantity,
            image: product.image,

            releaseDate: product.release_date
              ? new Date(product.release_date).toISOString() // ✅ Chuyển datetime(6) → ISO 8601
              : null
          };
        }),
        meta: {
          pagination: result.meta.pagination
        }
      };
      res.send(formattedResult);
    })
    .catch((error) => {
      console.error('database error: ', error);
      res.status(500).send({ error: 'Internal server error' });
    });
}
function getAllIsDelete(req, res) {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const validPage = pageNum ? pageNum : 1;
  const validLimit = limitNum > 0 ? limitNum : 10;

  productService.getAllProductsIsDelete(this.mysql, validPage, validLimit)
    .then((result) => {
      if (!result || !result.data) {
        res.status(404).send({ error: 'No products found' });
        return;
      }

      const formattedResult = {
        data: result.data.map(product => {
          console.log('Raw image_data:', product.image_data); // Debug xem có dữ liệu không

          return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            description: product.description,
            stockQuantity: product.stock_quantity,
            image: product.image,

            releaseDate: product.release_date
              ? new Date(product.release_date).toISOString() // ✅ Chuyển datetime(6) → ISO 8601
              : null
          };
        }),
        meta: {
          pagination: result.meta.pagination
        }
      };
      res.send(formattedResult);
    })
    .catch((error) => {
      console.error('database error: ', error);
      res.status(500).send({ error: 'Internal server error' });
    });
}
async function getOne(req, res) {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(req.server.mysql, id);
    const productImages = await productService.getProductImages(req.server.mysql, id);
    if (!product) {
      res.status(404).send({ error: 'Product not found' });
      return;
    }

    console.log('Raw product from DB:', product); // Debug xem có đủ dữ liệu không

    const formattedResult = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      stockQuantity: product.stock_quantity ?? null,
      image: product.image ?? null,

      releaseDate: product.release_date
        ? new Date(product.release_date).toISOString()
        : null,
      images: productImages
    };

    res.send(formattedResult);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

async function create(req, res) {
  try {
    const data = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!data || !data.name || !data.brand || !data.price || !data.stock_quantity) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    // Chuyển đổi định dạng `release_date`
    if (data.release_date) {
      data.release_date = new Date(data.release_date).toISOString();
    }

    const result = await productService.createProduct(req.server.mysql, data);
    if (!result.id) {
      throw new Error("Product creation failed");
    }

    const product = await productService.getOne(req.server.mysql, result.id);
    console.log("✅ Product created:", product);
    res.status(201).send(product);

  } catch (err) {
    console.error("🚨 Error creating product:", err);
    res.status(500).send({ error: "Internal Server Error", details: err.message });
  }
}
const handleUploadImage = async (req, res) => {
  try {
    const { image_url, color_name, price, product_id} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!image_url || !color_name || !price || !product_id ) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    // Gọi hàm uploadImage để thêm ảnh vào bảng `images` và `product_images`
    const result = await productService.uploadImage(req.server.mysql, { 
      image_url, 
      color_name, 
      price, 
      product_id, 
      
    });

    return res.status(201).send(result);  // Trả về kết quả thành công

  } catch (err) {
    console.error("Error uploading image:", err);
    return res.status(500).send({ error: "Internal Server Error", details: err.message });
  }
};

async function getNameProduct(req, res) {
  try {
    const products = await productService.getNameProducts(req.server.mysql);
    res.send(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const updatedProduct = req.body;
    const result = await productService.updateProduct(req.server.mysql, id, updatedProduct);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found or no changes made' });
    }

    res.send({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const result = await productService.deleteProduct(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.send({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function IsDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const result = await productService.softDeleteProduct(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found or already deleted' });
    }

    res.send({ message: 'Product soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const result = await productService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found or already deleted' });
    }

    res.send({ message: 'Product soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

const searchProduct = async (req, reply) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;  // Lấy query parameters từ URL
    const result = await productService.searchProducts(req.server.mysql, searchTerm, page, limit);
    reply.code(200).send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};
async function getByBrandName(req, res) {
  try {
    const { brand_name } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await productService.getProductsByBrandName(
      req.server.mysql,
      brand_name,
      pageNum,
      limitNum
    );

    const formatted = {
      data: result.data.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        description: product.description,
        stockQuantity: product.stock_quantity,
        image: product.image,
        releaseDate: product.release_date
          ? new Date(product.release_date).toISOString()
          : null
      })),
      meta: result.meta
    };

    res.send(formatted);
  } catch (err) {
    console.error('Error fetching products by brand:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

async function getByCategoryName(req, res) {
  try {
    const { category_name } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await productService.getProductsByCategoryName(
      req.server.mysql,
      category_name,
      pageNum,
      limitNum
    );

    const formatted = {
      data: result.data.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        description: product.description,
        stockQuantity: product.stock_quantity,
        image: product.image,
        releaseDate: product.release_date
          ? new Date(product.release_date).toISOString()
          : null
      })),
      meta: result.meta
    };

    res.send(formatted);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function getNewest(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const products = await productService.getNewestProducts(req.server.mysql, limit);

    const formatted = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      stockQuantity: product.stock_quantity,
      image: product.image,

      releaseDate: product.release_date
        ? new Date(product.release_date).toISOString() // ✅ Chuyển datetime(6) → ISO 8601
        : null
    }));

    res.send(formatted);
  } catch (err) {
    console.error('Error fetching newest products:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function updateStock(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { stock_quantity } = req.body; // stock_quantity sẽ là số lượng cần trừ

    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    // Kiểm tra stock_quantity có hợp lệ không
    if (isNaN(stock_quantity) || stock_quantity <= 0) {
      return res.status(400).send({ error: 'Invalid stock quantity' });
    }

    // Gọi service để cập nhật số lượng tồn kho
    const result = await productService.updateStockQuantity(req.server.mysql, id, stock_quantity);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Product not found or no changes made' });
    }

    res.send({ message: 'Stock quantity updated successfully' });
  } catch (err) {
    console.error('❌ Error updating stock:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}





module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  searchProduct,
  getByBrandName,
  getByCategoryName,
  getNewest,
  updateStock,
  getAllIsDelete,
  IsDelete,
  restore,
  getNameProduct,
  handleUploadImage
};
