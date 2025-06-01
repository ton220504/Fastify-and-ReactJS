import { NavLink, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from "react-bootstrap";

const Header = (props) => {
    return (
        <>
            <Navbar className="bg-body-tertiary" data-bs-theme="dark">
                <Navbar.Brand to="#home"><h2 className="ms-3">Trang quản lí</h2></Navbar.Brand>
                {/* <Navbar.Toggle /> */}
                {/* <Navbar.Collapse className="justify-content-end">
                    <img className="me-3" style={{ width: "30px", height: "30px" }} src="//bizweb.dktcdn.net/100/497/960/themes/923878/assets/favicon.png?1726452627090" alt="logo" />
                </Navbar.Collapse> */}
            </Navbar>

            <div className="container-fluid">
                <div className="row flex-nowrap" style={{ height: '90vh', overflow: 'hidden' }}>
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white " style={{ height: '100%', overflowY: 'auto' }}>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                {[
                                    { path: '/', label: 'Trang chủ', icon: 'bi-house' },
                                    { path: 'user', label: 'Người dùng', icon: 'bi-person' },
                                    { path: 'product', label: 'Sản phẩm', icon: 'bi-box-seam' },
                                    { path: 'brand', label: 'Thương hiệu', icon: 'bi-tags' },
                                    { path: 'categories', label: 'Danh mục', icon: 'bi-list-ul' },
                                    { path: 'topic', label: 'Topic', icon: 'bi-chat-dots' },
                                    { path: 'post', label: 'Bài viết', icon: 'bi-file-earmark-text' },
                                    { path: 'banner', label: 'Banner', icon: 'bi-image' },
                                    { path: 'review', label: 'Đánh giá sản phẩm', icon: 'bi-chat-left-text' },
                                    { path: 'postcomment', label: 'Bình luận bài viết', icon: 'bi bi-chat-left-dots' },
                                    { path: 'abate', label: 'Thanh toán', icon: 'bi-credit-card' },
                                    { path: 'Statistics', label: 'Thống kê', icon: 'bi-graph-up' }
                                ].map(({ path, label, icon }) => (
                                    <li key={path} className="nav-item">
                                        <NavLink
                                            to={path}
                                            end
                                            className={({ isActive }) =>
                                                `nav-link px-0 align-middle w-100 ${isActive ? "text-warning fw-bold" : "text-white"}`
                                            }
                                        >
                                            <i className={`bi ${icon}`}></i>
                                            <span className="ms-2 d-none d-sm-inline">{label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <hr />
                        </div>
                    </div>
                    <div className="col py-3" style={{
                        height: '90vh',
                        overflowY: 'auto',
                    }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;