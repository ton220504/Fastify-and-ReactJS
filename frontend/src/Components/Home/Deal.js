
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HotDeals from "./HotDeals";
import numeral from 'numeral';
import '../../assets/css/Deal.css';
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from '../../api/Api';

const Deal = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

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
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
                setFavoriteProducts(prev => prev.includes(productId) ? prev : [...prev, productId]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${ip}/products/newest`);
                const fetchProductsDeal = response.data;
                const updatedProducts = fetchProductsDeal.map((product) => ({
                    ...product,
                    imageUrl: product.image ? `${ip}/uploads/${product.image}` : "/images/default-placeholder.jpg"
                }));
                setProducts(updatedProducts);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(true);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <img style={{ width: "80px" }} src="./img/loading-gif-png-5.gif" alt="loading" />
            </div>
        );
    }

    return (
        <div className="my-deal container p-3 mt-3">
            <ToastContainer />
            <section className="content container">
                {/* Header: Flash deal times - Horizontal scroll on mobile */}
                <div className={isMobile ? "modern-scroll-wrapper" : "box-deal row"}>
                    <div className={isMobile ? "modern-scroll-item p-3 rounded" : "set-time col-4"} style={isMobile ? { backgroundColor: "#503eb6", color: "white", width: "100%", maxWidth: "300px" } : {}}>
                        <div className="d-flex align-items-center gap-2">
                            <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/flash-yl.png?1719291840576" style={{ width: "20px" }} alt="img" />
                            <h5 className="m-0" style={{ fontSize: "16px", fontWeight: "bold" }}>GIỜ VÀNG DEAL SỐC</h5>
                        </div>
                        <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                            <span>Kết thúc trong:</span>
                            <HotDeals />
                        </div>
                    </div>

                </div>

                {/* Products: Horizontal scroll on mobile */}
                <div className={isMobile ? "modern-scroll-wrapper mt-3" : "content-deal row p-2"}>
                    {products.length > 0 ? (
                        products.slice(0, 10).map((item) => (
                            <Card className={isMobile ? "modern-scroll-item box item-cart-deal" : "box col-2 m-2 item-cart-deal"}
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
                                <div>
                                    <p className="text_name" style={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.name}</p>
                                </div>
                                <div className="list-group-flush mt-auto">
                                    <hr />
                                    <p className="text_price" style={{ color: "#D10024", fontWeight: "bold" }}>{formatCurrency(item.price)}</p>
                                    <hr />
                                    <p className="text_plus" style={{ fontSize: "11px", color: "#28a745" }}>Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center w-100">Không có sản phẩm nào</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Deal;
