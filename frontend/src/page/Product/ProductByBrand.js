import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import { Card } from "react-bootstrap";


import "../../../src/assets/css/pagination.css";
import "../../assets/css/productbrand.css";
import { useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import {  ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaInstagram } from "react-icons/fa";


const ProductByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10; // Số sản phẩm mỗi trang
    const { brandName } = useParams(); // Lấy brand từ URL
    const navigate = useNavigate();
    const [banner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },

    ])
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };


    const handleAddToWishlist = async (productId) => {
        try {
            setLoading(true);
    
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
    
            if (!user || !user.id || !token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm yêu thích!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    navigate('/login');
                });
                return;
            }
    
            const response = await axios.post(
                "http://127.0.0.1:3000/api/wishlist",
                {
                    user_id: user.id,
                    product_id: productId
                }
            );
    
            const message = response.data?.message;
    
            if (message === "Product already in wishlist") {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    position: "top-end",
                    title: 'Sản phẩm đã có trong danh sách yêu thích',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    confirmButtonText: 'OK'
                });
    
                setFavoriteProducts(prev =>
                    prev.includes(productId) ? prev : [...prev, productId]
                );
            }
    
        } catch (error) {
            console.error("Lỗi khi thêm vào wishlist:", error);
            Swal.fire({
                toast: true,
                icon: 'error',
                position: "top-end",
                title: 'Có lỗi xảy ra khi thêm sản phẩm!',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };


    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:3000/api/products/category/${brandName}?page=${pageNumber}&limit=${perPage}`
            );

            const resData = response.data;

            if (resData) {
                const { data, meta } = resData;
                const { pagination } = meta;

                // Cập nhật state
                setProducts(data);
                setCurrentPage(pagination.page);
                setTotalPages(pagination.pageCount); // hoặc pagination.total nếu bạn muốn

                // Nếu cần xử lý ảnh
                fetchImagesAndUpdateProducts(data);
            }

        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [brandName, perPage]);

    // 🟢 Gọi API khi component mount hoặc khi brand thay đổi
    useEffect(() => {
        getProducts(1);
    }, [getProducts]);

    // 🟢 Điều hướng trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            getProducts(page);
        }
    };
    // Hàm fetch ảnh cho từng sản phẩm
    const fetchImagesAndUpdateProducts = async (data) => {
        if (!data || data.length === 0) return;
    
        const updatedProducts = data.map((product) => {
            const imageUrl = product.image
                ? `http://127.0.0.1:3000/uploads/${product.image}`
                : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có
    
            return { ...product, imageUrl };
        });
    
        setProducts(updatedProducts);
    };

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);
    // Xử lý chuyển trang



    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../img/loading-gif-png-5.gif" alt="Loading product by brand" />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <div className="ProductBrand mt-3">
                <ToastContainer />
                <div className="bannerAll">
                    <div className="contentAll containerAll">
                        {banner.map((item, index) => {
                            return (
                                <div className="col-4 " key={item.id}>
                                    <div>
                                        <img src={item.img} className="image" alt={item.name} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div >

                <div className="my-deal-phone container p-3 ">
                    <div className="content-deal row p-2">
                        {/* Lặp qua danh sách sản phẩm và hiển thị */}
                        {products.length > 0 ? (
                            products.slice(0, 10).map((item) => (
                                <Card className="box col-2 m-2 item-cart" key={item.id}>
                                    <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                    <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                        {/* Đổi icon dựa trên trạng thái yêu thích */}
                                        <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                    </div>
                                    <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                        <Card.Img
                                            className="product-image"
                                            src={item.imageUrl}
                                            alt={item.name}
                                        />
                                    </Link>
                                    <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                    <div>
                                        <p className="text_name">{item.name}</p>
                                    </div>
                                    <div className="list-group-flush">
                                        <hr />
                                        <p className="text_price">Giá: {formatCurrency(item.price)}</p>
                                        <hr />
                                        <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="NoProduct">Không có sản phẩm nào để hiển thị</div>
                        )}
                    </div>
                    {/* 🟢 Thanh phân trang */}
                    <div className="pageNumber">
                        <button
                            id="firstPage"
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <span id="page">Trang {currentPage} / {totalPages}</span>

                        <button
                            id="firstPage"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                                <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Phân trang */}


            </div>

        </>
    );
};

export default ProductByCategory;
