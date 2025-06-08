import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import ProductWishListDetail from './ProductWishListDetail';
import numeral from 'numeral';
import { Link, Navigate } from 'react-router-dom';
import "../../scss/Cart.scss";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { ip } from '../../api/Api';
import Swal from "sweetalert2";

const WishList = () => {
    const [wishlist, setWishList] = useState([]);
    const [productPrices, setProductPrices] = useState({}); // Lưu giá sản phẩm
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };


    const fetchWishlist = async (token,user) => {
        try {
            if (!token || !user || !user.id) {
                console.log("Không có token hoặc user ID, yêu cầu đăng nhập!");
                setUser(null);
                return;
            }
    
            const response = await axios.get(`http://127.0.0.1:3000/api/wishlist/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const cartData = response.data;
    
            if (!cartData || !cartData.items || cartData.items.length === 0) {
                setWishList([]);
                return;
            }
    
            const updatedCartItems = await Promise.all(
                cartData.items.map(async (item) => {
                    try {
                        const productRes = await axios.get(`http://127.0.0.1:3000/api/products/${item.product_id}`);
                        const product = productRes.data;
    
                        const imageUrl = `http://127.0.0.1:3000/uploads/${product.image}`;
    
                        return {
                            id: item.id,
                            quantity: item.quantity,
                            product: {
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                brand: product.brand,
                                category: product.category,
                                price: product.price,
                                stockQuantity: product.stockQuantity,
                                releaseDate: product.releaseDate,
                                productAvailable: product.productAvailable,
                                imageUrl,
                            },
                        };
                    } catch (err) {
                        console.error(`Lỗi khi lấy sản phẩm ${item.product_id}:`, err);
                        return {
                            id: item.id,
                            quantity: item.quantity,
                            product: {
                                id: item.product_id,
                                name: "Không xác định",
                                imageUrl: "/images/default-placeholder.jpg",
                            },
                        };
                    }
                })
            );
    
            setWishList(updatedCartItems);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        } finally {
            setLoadingCart(false);
        }
    };
    const handleRemove = async (wishlistItemId) => {
        try {
            
            await axios.delete(`http://localhost:3000/api/wishlist/${wishlistItemId}`);
            setFavoriteProducts(prevFavorites => prevFavorites.filter(id => id !== wishlistItemId));
            setWishList(prevItems => prevItems.filter(item => item.id !== wishlistItemId));
            console.log("Sản phẩm đã được xóa khỏi yêu thích!");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    const checkUserLogin = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const user = await getUserData(token);
                await fetchWishlist(token, user); // <-- Truyền user trực tiếp
            } catch (err) {
                console.error("Không thể xác thực người dùng:", err);
            } finally {
                setLoadingUser(false);
            }
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    };
    

    // // Hàm lấy thông tin người dùng từ API
    const getUserData = async () => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
    
        if (!token || !user || !user.id) {
            console.log("Không có token hoặc user ID, yêu cầu đăng nhập!");
            setUser(null);
            return;
        }
    
        try {
            const response = await axios.get(`http://127.0.0.1:3000/api/users/${user.id}`);
            if (response.data) {
                const roles = [response.data.role];
                const userData = { ...response.data, roles };
    
                setUser(userData);
                //console.log("User roles:", roles);
                //console.log("id", response.data.id);
    
                return userData; // ✅ thêm dòng này để trả về user
            } else {
                console.error("Dữ liệu user không hợp lệ:", response.data);
                setUser(null);
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            window.location.reload();
        }
    };
    // Gọi hàm khi component được render
    useEffect(() => {
        checkUserLogin();
        getUserData();
    }, []);



    if (loadingUser) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ height: "300px" }}>
                <h2 style={{ paddingTop: "100px", fontWeight: "bold", color: "red" }}>Bạn cần đăng nhập để xem sản phẩm yêu thích</h2>
                <p>Đăng nhập
                    <Link to="/login" className='ms-1'>
                        {/* <Button variant="primary">Đăng nhập</Button> */}
                        tại đây
                    </Link>
                </p>


            </div>
        );
    }

    if (loadingCart) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    return (

        <>
            <ComeBack />
            <div className="mynocart container mt-2">
                <h5 className="title-cart" style={{ color: "red", fontSize: "20px", fontWeight: "bolder", fontStyle: "italic", paddingTop: "10px", paddingBottom: "10px" }}>Sản phẩm yêu thích của bạn</h5>
            </div>
            {wishlist.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm yêu thích nào</span>
                    </div>
                </div>
            ) : (
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                        <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {wishlist.length > 0 ? (
                                wishlist.map((item, index) => (
                                    <Card className="box col-2 m-2 item-cart" key={index}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                        {/* <div className="favorite-icon" >
                                            <i className={favoriteProducts.includes(item.product.id) ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
                                        </div> */}
                                        <div
                                            className="favorite-icon"
                                            onClick={() => {
                                                handleRemove(item.id); // Xóa sản phẩm yêu thích
                                            }}
                                        >
                                            <i className={favoriteProducts.includes(item.product.id) ? "fas fa-heart text-red-500" : "fas fa-heart"}></i>
                                        </div>

                                        <Link to={`/chi-tiet-san-pham/${item.product.id}`}>
                                            <Card.Img
                                                className="product-image"
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                            />
                                        </Link>
                                        <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                        <div>
                                            <p className="text_name">{item.product.name}</p>
                                        </div>
                                        <div className="list-group-flush">
                                            <hr />
                                            <p className="text_price">Giá: {formatCurrency(item.product.price)}</p>
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
            )}


        </>
    );
};

export default WishList;
