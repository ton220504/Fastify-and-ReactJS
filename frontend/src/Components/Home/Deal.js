
import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios
import HotDeals from "./HotDeals";
import numeral from 'numeral';
import '../../assets/css/Deal.css'; // Đảm bảo rằng đường dẫn đến file CSS là chính xác
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../api/Api";




const Deal = () => {
    // State để lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    // Hàm thêm vào yêu thích
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


    // Gọi API khi component được mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/products/newest");
                const fetchProductsDeal = response.data;
                setProducts(fetchProductsDeal);
                fetchImagesAndUpdateProducts(fetchProductsDeal);
                setLoading(false);
            } catch (error) {
                console.log("Lỗi: ", error);
                setLoading(true);
            }
        };

        fetchProducts();

    }, []);  // Chỉ gọi 1 lần khi component được render
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
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" />
            </div>
        );
    }

    return (
        <div className="my-deal container p-3 mt-3">
            <ToastContainer />
            <section className="content container" >
                <div className="box-deal"
                    // style={{
                    //     display: 'flex',
                    //     overflowX: 'auto',  // Bật thanh cuộn ngang
                    //     whiteSpace: 'nowrap',  // Ngăn các sản phẩm xuống hàng
                    //     scrollBehavior: 'smooth',  // Hiệu ứng cuộn mượt
                    //     gap: '10px',  // Khoảng cách giữa các sản phẩm
                    //     paddingBottom: '10px'  // Tránh che mất phần dưới
                    // }}
                >
                    <div className="set-time col-4">
                        <div className="icon">
                            <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/flash-yl.png?1719291840576"
                                style={{ width: "15px" }}
                            />
                        </div>
                        {/* <div className="content">
                            <h4>GIỜ VÀNG DEAL SỐC</h4>
                            <span className="text-white">Kết thúc trong:<HotDeals/></span>
                            
                        </div> */}
                        <div className="content">
                            <h4 className="title-time-deal">GIỜ VÀNG DEAL SỐC</h4>
                            <div className="timer-container">
                                <span className="end">Kết thúc trong:</span>
                                <HotDeals /> {/* Đây là component đếm ngược */}
                            </div>
                        </div>


                    </div>
                    <div className="is-going-on col-4">
                        <Link>
                            <span>12:00 - 20:00</span><br />
                            <span>Đang diễn ra</span>
                        </Link>
                    </div>
                    <div className="coming-soon col-4">
                        <Link>
                            <span>20:00 - 24:00</span><br />
                            <span>Sắp diễn ra</span>
                        </Link>
                    </div>
                </div>

                <div className="content-deal row p-2">
                    {/* Lặp qua danh sách sản phẩm và hiển thị */}
                    {products.length > 0 ? (
                        products.slice(0, 5).map((item) => (
                            <Card className="box col-2 m-2 item-cart-deal" key={item.id}>
                                <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                    {/* Đổi icon dựa trên trạng thái yêu thích */}
                                    <i className={favoriteProducts.includes(item.id) ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
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
        </div>
    );
};

export default Deal;


