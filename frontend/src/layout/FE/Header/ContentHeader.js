import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ip } from "../../../api/Api";
import "../../../assets/css/header.css";
const ContentHeader = () => {
    const [menu, setMenu] = useState([
        { id: 1, name: "iPhone 15" },
        { id: 2, name: "Xiaomi" },
        { id: 3, name: "Samsung" },
        { id: 4, name: "Galaxy S23" },
        { id: 5, name: "Realme C25s" }
    ]);
    const [user, setUser] = useState(null); // Trạng thái lưu người dùng
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate(); // Hook để điều hướng trang
    const [show, setShow] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const handleMouseEnter = () => setShow(true);
    const handleMouseLeave = () => setShow(false);
    const handleMouseEnterUser = () => setShowUser(true);
    const handleMouseLeaveUser = () => setShowUser(false);
    const [cartItemCount, setCartItemCount] = useState(0); // Đếm sản phẩm giỏ hàng
    const [WishListItemCount, setWishListItemCount] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);

    //category
    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/category");
                //console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchcategory();
    }, []);
    // Hàm kiểm tra token khi component được render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchData = async () => {
                await getUserData(token);         // Đảm bảo get user xong
                await fetchCartCount();           // Rồi mới gọi đếm cart
                await fecthCountWishlist();       // Rồi gọi wishlist
            };
            fetchData(); // Gọi hàm async wrapper
            const interval = setInterval(() => {
                fetchCartCount();
                fecthCountWishlist();
            }, 2000);
            return () => clearInterval(interval);
        } else {
            console.log("Lỗi....... Không có token");
        }
    }, []);
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
                // Nếu roles là 1 string như "user" hoặc "admin"
                const roles = [response.data.role]; // Chuyển thành mảng

                setUser({ ...response.data, roles });
                //console.log("User roles:", roles);
            } else {
                console.error("Dữ liệu user không hợp lệ:", response.data);
                setUser(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("Token hết hạn hoặc không hợp lệ.");
            } else {
                console.error("Lỗi lấy thông tin người dùng:", error);
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };
    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("token"); // Xóa token khỏi localStorage
        localStorage.removeItem("user");
        setUser(null); // Xóa thông tin người dùng
        navigate("/"); // Điều hướng về trang chủ sau khi đăng xuất
        window.location.reload(); // Tải lại trang
    };
    const fetchCartCount = async () => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            if (!user || !user.id) {
                console.log("Không tìm thấy user");
                return;
            }

            const response = await axios(`http://localhost:3000/api/carts/count/${user.id}`);
            const cartCountFromBackend = response.data.count;

            setCartItemCount(cartCountFromBackend);
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    }
    const fecthCountWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            if (!user || !user.id) {
                console.log("không tìm thấy user");
                return;
            }
            const response = await axios.get(`http://localhost:3000/api/wishlist/count/${user.id}`);
            const wishlistcountFrombackend = response.data.count;
            setWishListItemCount(wishlistcountFrombackend);

        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }
    return (
        <div className="content-header">
            <div className="container">
                <div className="row">
                    <div className="col-2 category">
                        <Dropdown
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            show={show}
                            onToggle={(isOpen) => setShow(isOpen)} // Thêm để kiểm soát
                        >
                            <Dropdown.Toggle className="dropdown-toggle" variant="warning" id="dropdown-basic-category">
                                Danh mục sản phẩm
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/tat-ca-san-pham">
                                    Tất cả sản phẩm
                                </Dropdown.Item>
                                {categories.length > 0 ? (
                                    categories.map((bra) => (
                                        <Dropdown.Item key={bra.name} href={`/san-pham-theo-loai/${bra.name}`}>
                                            {bra.name}

                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>Không có danh mục nào</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>
                    <div className="col-6 hot-product">
                        <b> Sản phẩm HOT:</b>
                        {menu.map((item) => (
                            <div className="item-product" key={item.id}>
                                <div>
                                    {item.name}
                                    <img
                                        className="icon-hot"
                                        src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/hot_icon.png?1719291840576"
                                        alt="Hot Icon"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-4 user-cart-wishlist">
                        <div className="function user" id="user-icon">
                            {user ? (
                                <div
                                    className="function user position-relative"
                                    id="user-dropdown-wrapper"
                                    onMouseEnter={() => setShowUser(true)}
                                    onMouseLeave={() => setShowUser(false)}
                                    style={{ display: "inline-block" }}
                                >
                                    <Dropdown show={showUser}>
                                        <Dropdown.Toggle
                                            className="text-white"
                                            variant="toggle"
                                            id="dropdown-basic"
                                            style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                                        >
                                            <FaUser style={{ width: "20px", height: "20px", verticalAlign: "middle" }} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="custom-dropdown-menu" >
                                            <Dropdown.Item className="text-black">
                                                <span className="text-danger">{user?.username}</span>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item className="text-black">
                                                <Link className="text-black" to="/thong-tin">Thông tin đơn hàng</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            {user?.role?.includes("admin") && (
                                                <>
                                                    <Dropdown.Item className="text-black">
                                                        <Link className="text-black fw-bold" to="/admin">Dashboard</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                </>
                                            )}
                                            <Dropdown.Item className="text-black" onClick={logout}>Đăng xuất</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                            ) : (
                                <Dropdown
                                    onMouseEnter={handleMouseEnterUser}
                                    onMouseLeave={handleMouseLeaveUser}
                                    show={showUser}
                                    onToggle={(isOpen) => setShowUser(isOpen)}
                                >
                                    <Dropdown.Toggle className="text-white" variant="toggle" id="dropdown-basic" style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
                                        <FaUser style={{ width: "20px", height: "20px", verticalAlign: "middle" }} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item className="text-black">
                                            <Link className="text-black" to="/login">
                                                Đăng nhập
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="text-black">
                                            <Link className="text-black" to="/dangki">
                                                Đăng ký
                                            </Link>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>

                        <div className="ms-5 text-white position-relative " id="cart-icon">
                            <Link to="/gio-hang">
                                <FaShoppingCart style={{ width: "20px", height: "20px", color: "white" }} />
                                {cartItemCount > 0 && (
                                    <span
                                        className="badge bg-danger text-white"
                                        style={{
                                            position: "absolute",
                                            top: "-7px",
                                            right: "-10px",
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="ms-5 text-white position-relative " id="wishlish-icon">
                            <Link to="/yeu-thich">
                                <FaHeart style={{ width: "20px", height: "20px", color: "white" }} />
                                {WishListItemCount > 0 && (
                                    <span
                                        className="badge bg-danger text-white"
                                        style={{
                                            position: "absolute",
                                            top: "-7px",
                                            right: "-10px",
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {WishListItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentHeader;
