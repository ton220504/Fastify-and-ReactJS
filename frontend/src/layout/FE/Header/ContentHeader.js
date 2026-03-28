import React, { useEffect, useState, useCallback } from "react";
import { Dropdown, Offcanvas } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaHeart, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/header.css";
import { ip } from "../../../api/Api";

const ContentHeader = () => {
    const [menu] = useState([
        { id: 1, name: "iPhone 15" },
        { id: 2, name: "Xiaomi" },
        { id: 3, name: "Samsung" },
        { id: 4, name: "Galaxy S23" },
        { id: 5, name: "Realme C25s" }
    ]);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const handleMouseEnter = () => setShow(true);
    const handleMouseLeave = () => setShow(false);
    const handleMouseEnterUser = () => setShowUser(true);
    const handleMouseLeaveUser = () => setShowUser(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [WishListItemCount, setWishListItemCount] = useState(0);

    // Mobile menu state
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getUserData = useCallback(async (token) => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (!token || !user || !user.id) {
            console.log("Không có token hoặc user ID, yêu cầu đăng nhập!");
            setUser(null);
            return;
        }

        try {
            const response = await axios.get(`${ip}/users/${user.id}`);
            if (response.data) {
                const roles = [response.data.role];
                setUser({ ...response.data, roles });
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
    }, [navigate]);

    const fetchCartCount = useCallback(async () => {
        try {
            const userString = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            const user = userString ? JSON.parse(userString) : null;
            if (!user || !user.id) {
                console.log("Không tìm thấy user");
                return;
            }

            const response = await axios.get(`${ip}/carts/count/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cartCountFromBackend = response.data.count;

            setCartItemCount(cartCountFromBackend);
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    }, []);

    const fecthCountWishlist = useCallback(async () => {
        try {
            const userString = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            const user = userString ? JSON.parse(userString) : null;
            if (!user || !user.id) {
                console.log("không tìm thấy user");
                return;
            }
            const response = await axios.get(`${ip}/wishlist/count/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const wishlistcountFrombackend = response.data.count;
            setWishListItemCount(wishlistcountFrombackend);

        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }, []);

    //category
    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get(`${ip}/category`);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchData = async () => {
                await getUserData(token);
                await fetchCartCount();
                await fecthCountWishlist();
            };
            fetchData();
            const interval = setInterval(() => {
                fetchCartCount();
                fecthCountWishlist();
            }, 2000);
            return () => clearInterval(interval);
        } else {
            console.log("Lỗi....... Không có token");
        }
    }, [getUserData, fetchCartCount, fecthCountWishlist]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
        window.location.reload();
    };

    // ===== MOBILE LAYOUT =====
    if (isMobile) {
        return (
            <>
                <div className="content-header">
                    <div className="container">
                        <div className="row align-items-center" style={{ minHeight: "45px" }}>
                            {/* Left: Hot products (scrollable) */}
                            <div className="col hot-product-mobile">
                                <b>HOT: </b>
                                {menu.map((item) => (
                                    <span className="hot-item-mobile" key={item.id}>
                                        {item.name}
                                        <img
                                            className="icon-hot"
                                            src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/hot_icon.png?1719291840576"
                                            alt="Hot"
                                            style={{ width: 18, height: 12, marginLeft: 2 }}
                                        />
                                    </span>
                                ))}
                            </div>

                            {/* Right side: User, Cart, Wishlist, Hamburger */}
                            <div className="col-auto d-flex align-items-center gap-3">
                                {/* User */}
                                <div className="text-white position-relative" id="user-icon">
                                    {user ? (
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                className="text-white p-0"
                                                variant="toggle"
                                                style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                                            >
                                                <FaUser style={{ width: "18px", height: "18px" }} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="custom-dropdown-menu">
                                                <Dropdown.Item>
                                                    <span className="text-danger">{user?.username}</span>
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item>
                                                    <Link className="text-black" to="/thong-tin">Thông tin đơn hàng</Link>
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                {user?.role?.includes("admin") && (
                                                    <>
                                                        <Dropdown.Item>
                                                            <Link className="text-black fw-bold" to="/admin">Dashboard</Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                    </>
                                                )}
                                                <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : (
                                        <Dropdown>
                                            <Dropdown.Toggle className="text-white p-0" variant="toggle" style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
                                                <FaUser style={{ width: "18px", height: "18px" }} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item><Link className="text-black" to="/login">Đăng nhập</Link></Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item><Link className="text-black" to="/dangki">Đăng ký</Link></Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>

                                {/* Cart */}
                                <div className="text-white position-relative" id="cart-icon" style={{ marginTop: 0 }}>
                                    <Link to="/gio-hang">
                                        <FaShoppingCart style={{ width: "18px", height: "18px", color: "white" }} />
                                        {cartItemCount > 0 && (
                                            <span className="badge bg-danger text-white"
                                                style={{ position: "absolute", top: "-7px", right: "-10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px" }}>
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Wishlist */}
                                <div className="text-white position-relative" id="wishlish-icon" style={{ marginTop: 0 }}>
                                    <Link to="/yeu-thich">
                                        <FaHeart style={{ width: "18px", height: "18px", color: "white" }} />
                                        {WishListItemCount > 0 && (
                                            <span className="badge bg-danger text-white"
                                                style={{ position: "absolute", top: "-7px", right: "-10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px" }}>
                                                {WishListItemCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Hamburger Menu Button */}
                                <button
                                    className="btn-hamburger"
                                    onClick={() => setShowMobileMenu(true)}
                                    aria-label="Menu"
                                >
                                    <FaBars style={{ width: "20px", height: "20px", color: "white" }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offcanvas Mobile Menu */}
                <Offcanvas
                    show={showMobileMenu}
                    onHide={() => setShowMobileMenu(false)}
                    placement="end"
                    className="mobile-menu-offcanvas"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title style={{ color: "#503eb6", fontWeight: "bold" }}>
                            Danh mục sản phẩm
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ul className="mobile-category-list">
                            <li>
                                <Link to="/tat-ca-san-pham" onClick={() => setShowMobileMenu(false)}>
                                    📱 Tất cả sản phẩm
                                </Link>
                            </li>
                            {categories.length > 0 ? (
                                categories.map((bra) => (
                                    <li key={bra.name}>
                                        <Link to={`/san-pham-theo-loai/${bra.name}`} onClick={() => setShowMobileMenu(false)}>
                                            {bra.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted">Không có danh mục nào</li>
                            )}
                        </ul>

                        <hr />
                        <div className="mobile-menu-info">
                            <p>📞 Hỗ trợ 24/24: <strong>19001005</strong></p>
                            <p>🏪 8 hệ thống cửa hàng</p>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    }

    // ===== DESKTOP LAYOUT =====
    return (
        <div className="content-header">
            <div className="container">
                <div className="row">
                    <div className="col-2 category">
                        <Dropdown
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            show={show}
                            onToggle={(isOpen) => setShow(isOpen)}
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
