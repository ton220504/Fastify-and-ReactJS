import { useCallback, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import Swal from "sweetalert2";
import '../../../scss/Accessory.scss'
import {  ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




const ProductiPhone = () => {

    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const perPage = 10; // Số sản phẩm mỗi trang
    const [, setCurrentPage] = useState(1);
    const [, setTotalPages] = useState(1);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const navigate = useNavigate();


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
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
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


    // 🟢 Hàm gọi API lấy sản phẩm theo trang
    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:3000/api/products/brand/apple?page=${pageNumber}&limit=${perPage}`
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
    }, [perPage, setCurrentPage, setTotalPages]);
    // 🟢 Gọi API khi component mount
    useEffect(() => {
        getProducts(1);
    }, [getProducts]);


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


    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,
            }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading" />
            </div>
        );
    }

    return (
        <div className="accessory mt-5">
            <section className="content container">
                <ToastContainer />
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">iPhone</span>Nổi bật
                    </Link>
                    <div className="link-title">
                        <Link>iPhone 15 </Link>
                        <Link>iPhone 14 </Link>
                        <Link>iPhone 13 </Link>
                        <Link>iPhone 12 </Link>
                        <Link>iPhone 11 </Link>
                    </div>
                </div>
                <div className="my-deal-phone  p-3 mt-3">
                    <section className="content container">
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
                                <div>Không có sản phẩm nào để hiển thị</div>
                            )}
                        </div>
                    </section>
                    {/* 🟢 Thanh phân trang */}

                </div>


            </section>
        </div>
    )
}

export default ProductiPhone;
