
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [image, setImage] = useState();
    const [updateProduct, setUpdateProduct] = useState({
        id: null,
        name: "",
        description: "",
        brand: "",
        price: "",
        category: "",
        releaseDate: "",
        productAvailable: 0,
        stockQuantity: "",
        isDelete: 0,
    });
    const [brands, setBrands] = useState([]);
    const [category, setCategory] = useState([]);

    //gọi brand
    useEffect(() => {
        const fetchcbrand = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/brand");
                //console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setBrands(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchcbrand();
    }, []);
    //gọi category
    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/category");
                //console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setCategory(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchcategory();
    }, []);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/products/${id}`);
                let productData = response.data;

                // Kiểm tra category có hợp lệ không, nếu không gán giá trị mặc định
                if (!productData.category) {
                    productData.category = ""; // Gán giá trị mặc định nếu category không tồn tại
                }
                const updatedProduct = {
                    ...productData,
                    imageUrl: productData.image
                        ? `http://127.0.0.1:3000/uploads/${productData.image}`
                        : "/images/default-placeholder.jpg",
                    imagesurl: productData.images.map((img) => ({
                        imageUrl: `http://127.0.0.1:3000/uploads/${img.url}`
                    }))
                };
                setProduct(updatedProduct);
                setUpdateProduct(updatedProduct);

            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageFilename = updateProduct.image;

            // Nếu người dùng chọn ảnh mới thì upload ảnh trước
            if (image) {
                const formData = new FormData();
                formData.append("imageFile", image);

                const uploadRes = await axios.post("http://localhost:3000/api/upload", formData);
                imageFilename = uploadRes.data.filename;
            }

            // Tạo object đúng cấu trúc
            const productData = {
                name: updateProduct.name,
                brand: updateProduct.brand,
                category: updateProduct.category,
                price: Number(updateProduct.price),
                description: updateProduct.description,
                stock_quantity: Number(updateProduct.stockQuantity),
                image: imageFilename,
                release_date: new Date(updateProduct.releaseDate).toISOString(),
                product_available: 0,
                isDelete: updateProduct.isDelete
            };

            const token = localStorage.getItem("token");

            await axios.put(`http://localhost:3000/api/products/${id}`, productData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                text: "Sửa thành công.",
                timer: 2000,
                timerProgressBar: true
            });

        } catch (error) {
            console.error("Lỗi khi sửa sản phẩm:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Có lỗi xảy ra!",
            });
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateProduct({ ...updateProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="update-product-container">
            <div className="center-container" style={{ marginTop: "7rem", maxWidth: "700px", margin: "0 auto", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", background: "#fff", borderRadius: "8px" }}>
                <h2 className="text-center pb-3">Sửa sản phẩm</h2>
                <form className="row g-3 pt-1" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label"><strong>Tên sản phẩm</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={product.name}
                            value={updateProduct.name}
                            onChange={handleChange}
                            name="name"
                        />
                    </div>
                    <div className="col-md-6">

                        <label className="form-label"><strong>Thương Hiệu</strong></label>
                        {brands.length > 0 ? (
                            <select
                                className="form-select"
                                onChange={handleChange}
                                value={updateProduct.brand}
                                name="brand"
                                required
                            >
                                {brands.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}

                            </select>
                        ) : (
                            <span>Không có brand</span>
                        )}
                    </div>
                    <div className="col-12">
                        <label className="form-label"><strong>Mô tả</strong></label>
                        <textarea
                            className="form-control"
                            placeholder={product.description}
                            name="description"
                            onChange={handleChange}
                            value={updateProduct.description}
                            rows="3"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Giá</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={handleChange}
                            value={updateProduct.price}
                            placeholder={product.price}
                            name="price"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Danh mục</strong></label>
                        {category.length > 0 ? (
                            <select
                                className="form-select"
                                onChange={handleChange}
                                value={updateProduct.category}
                                name="category"
                                required
                            >
                                {category.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}

                            </select>
                        ) : (
                            <span>Không có category</span>
                        )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label"><strong>Tồn kho</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={handleChange}
                            placeholder={product.stockQuantity}
                            value={updateProduct.stockQuantity}
                            name="stockQuantity"
                        />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label"><strong>Hình ảnh</strong></label>
                        <div className="image-preview mb-2">
                            <img
                                src={product.imageUrl}
                                alt={product.imageUrl}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleImageChange}
                            name="imageUrl"
                        />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label"><strong>Hình ảnh liên quan</strong></label>
                        <div className="image-preview mb-2">
                            {product?.imagesurl?.length > 0 ? (
                                product.imagesurl.map((images, index) => (
                                    <img
                                        key={index}
                                        height="60px"
                                        width="60px"
                                        src={images.imageUrl}
                                        alt={`Ảnh liên quan ${images.name}`}  // Cập nhật alt để rõ ràng hơn
                                        onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                                    />
                                ))
                            ) : (
                                <div>Không có ảnh liên quan</div>
                            )}
                        </div>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleImageChange}
                            name="imageUrl"
                            multiple
                            accept="image/*"
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
