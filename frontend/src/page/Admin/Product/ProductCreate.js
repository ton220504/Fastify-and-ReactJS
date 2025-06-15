
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import "./AddProduct.css"; // Tạo file CSS riêng nếu muốn tuỳ chỉnh thêm

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
        isDelete: 0,
    });
    const [image, setImage] = useState(null);
    const [brands, setBrands] = useState([]);
    const [category, setCategory] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    
    //gọi brand
    useEffect(() => {
        const fetchbrand = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/brand");
                console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setBrands(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchbrand();
    }, []);
    //gọi category
    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/category");
                console.log(response.data); // Kiểm tra dữ liệu trả về
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
        if (brands.length > 0 && !product.brand) {
            setProduct(prev => ({ ...prev, brand: brands[0].name }));
        }
    }, [brands]);

    useEffect(() => {
        if (category.length > 0 && !product.category) {
            setProduct(prev => ({ ...prev, category: category[0].name }));
        }
    }, [category]);

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            // 1. Upload ảnh trước
            const imageForm = new FormData();
            imageForm.append("file", image);

            const uploadRes = await axios.post("http://localhost:3000/api/upload", imageForm);
            const imageName = uploadRes.data.filename;

            // 2. Format lại ngày đúng chuẩn ISO
            const formattedDate = new Date(product.releaseDate).toISOString();

            // 3. Tạo object sản phẩm chuẩn API yêu cầu
            const productData = {
                name: product.name,
                brand: product.brand,
                category: product.category,
                price: Number(product.price),
                description: product.description,
                stock_quantity: Number(product.stockQuantity),
                image: imageName,
                release_date: formattedDate,
                product_available: 0,
                isDelete: product.isDelete
            };

            // 4. Gửi lên API
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/products", productData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Product added successfully:", response.data);
            Swal.fire({
                toast: true,
                icon: "success",
                position: "top-end",
                text: "Thêm sản phẩm thành công!",
                timer: 2000,
                timerProgressBar: true
            });

            // Reset form
            setProduct({
                name: "",
                brand: "",
                description: "",
                price: "",
                category: "",
                stockQuantity: "",
                releaseDate: "",
                productAvailable: false,
                isDelete: 0,
            });
            setImage(null);
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            Swal.fire({
                icon: "error",
                text: "Thêm sản phẩm thất bại!",

            });
        }
    };



    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "800px" }}>
                <h2 className="text-center mb-4">Thêm Sản Phẩm Mới</h2>
                <form className="row g-3" onSubmit={submitHandler}>
                    <div className="col-md-6">
                        <label className="form-label"><strong>Tên Sản Phẩm</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên sản phẩm"
                            onChange={handleInputChange}
                            value={product.name}
                            name="name"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label"><strong>Thương Hiệu</strong></label>
                        {brands.length > 0 ? (
                            <select
                                className="form-select"
                                onChange={handleInputChange}
                                value={product.brand}
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
                        <label className="form-label"><strong>Mô Tả</strong></label>
                        <textarea
                            className="form-control"
                            placeholder="Thêm mô tả sản phẩm"
                            value={product.description}
                            name="description"
                            onChange={handleInputChange}
                            required
                            rows="3"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Giá</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ví dụ: 1000"
                            onChange={handleInputChange}
                            value={product.price}
                            name="price"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Danh mục</strong></label>
                        {category.length > 0 ? (
                            <select
                                className="form-select"
                                onChange={handleInputChange}
                                value={product.category}
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
                        <label className="form-label"><strong>Số Lượng Tồn Kho</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Số lượng còn lại"
                            onChange={handleInputChange}
                            value={product.stockQuantity}
                            name="stockQuantity"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Ngày thêm sản phẩm</strong></label>
                        <input
                            type="date"
                            className="form-control"
                            value={product.releaseDate}
                            name="releaseDate"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Hình ảnh</strong></label>
                        <input
                            accept="image/*"
                            className="form-control"
                            type="file"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    {/* <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAvailable"
                                id="gridCheck"
                                checked={product.productAvailable}
                                onChange={(e) =>
                                    setProduct({ ...product, productAvailable: e.target.checked })
                                }
                            />
                            <label className="form-check-label">Product Available</label>
                        </div>
                    </div> */}
                    
                    <div className="col-12">
                        <button type="submit" className="btn btn-success w-100">
                            Thêm Sản Phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
