import { useCallback, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import '../../../scss/Accessory.scss'
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../../api/Api";

const ProductSamsung = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const perPage = 10;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const handleAddToWishlist = async (productId) => {
        try {
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
    
            const response = await axios.post(`${ip}/wishlist`, {
                user_id: user.id,
                product_id: productId
            });
    
            if (response.data?.message === "Product already in wishlist") {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    position: "top-end",
                    title: 'Sản phẩm đã có trong danh sách yêu thích',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    timer: 2000,
                    showConfirmButton: false
                });
                setFavoriteProducts(prev => prev.includes(productId) ? prev : [...prev, productId]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`${ip}/products/brand/samsung?page=${pageNumber}&limit=${perPage}`);
            const resData = response.data;
            if (resData) {
                const updatedProducts = resData.data.map((product) => ({
                    ...product,
                    imageUrl: product.image ? `${ip}/uploads/${product.image}` : "/images/default-placeholder.jpg"
                }));
                setProducts(updatedProducts);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [perPage]);

    useEffect(() => {
        getProducts(1);
    }, [getProducts]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <img style={{ width: "80px" }} src="./img/loading-gif-png-5.gif" alt="Loading" />
            </div>
        );
    }

    return (
        <div className="accessory mt-5">
            <ToastContainer />
            <section className="content container">
                <div className="title-index d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <Link className="name-title" style={{ textDecoration: "none" }}>
                        <span className="phukien-link" style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Samsung</span> Nổi bật
                    </Link>
                    <div className={isMobile ? "modern-scroll-wrapper mobile-sub-links" : "link-title"} style={isMobile ? { padding: "0", gap: "10px" } : {}}>
                        {["Galaxy S Series", "Galaxy Note Series", "Galaxy Tab Series"].map((link, idx) => (
                            <Link key={idx} href="#" style={{ fontSize: "14px", whiteSpace: "nowrap", display: "inline-block", color: "#555" }}>{link}</Link>
                        ))}
                    </div>
                </div>

                <div className={isMobile ? "my-deal-phone-mobile mt-3" : "my-deal-phone container p-3 mt-3"}>
                    <div className={isMobile ? "modern-scroll-wrapper" : "content-deal row p-2"}>
                        {products.length > 0 ? (
                            products.map((item) => (
                                <Card className={isMobile ? "modern-scroll-item item-cart" : "box col-2 m-2 item-cart"} 
                                      style={isMobile ? { width: "220px", marginBottom: "0" } : {}}
                                      key={item.id}>
                                    <div className="discount-badge">-9%</div>
                                    <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                        <i className={favoriteProducts.includes(item.id) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                                    </div>
                                    <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                        <Card.Img className="product-image" src={item.imageUrl} alt={item.name} />
                                    </Link>
                                    <div className="official-badge">Chính Hãng 100%</div>
                                    <div className="p-2">
                                        <p className="text_name" style={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontSize: "14px" }}>{item.name}</p>
                                        <hr className="my-1" />
                                        <p className="text_price m-0" style={{ color: "#D10024", fontWeight: "bold" }}>{formatCurrency(item.price)}</p>
                                        <hr className="my-1" />
                                        <p className="text_plus mb-0" style={{ fontSize: "11px", color: "#28a745" }}>Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center w-100">Không có sản phẩm nào</div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductSamsung;