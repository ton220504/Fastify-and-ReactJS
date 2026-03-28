import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../scss/AllProduct.scss";
import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import axios from "axios";
import { Card, Offcanvas, Button } from "react-bootstrap";
import "../../../src/assets/css/pagination.css";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaInstagram, FaFilter } from "react-icons/fa";
import { Grid, List } from 'lucide-react';
import { ip } from "../../api/Api";

const AllProduct = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 12; // Tăng lên 12 để chia hết cho 2, 3, 4, 6
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState('default');
    const [brandFilter, setBrandFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const [banner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },
    ]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${ip}/category`);
            if (response.data) setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${ip}/brand`);
            if (response.data) setBrands(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const handleAddToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id || !token) {
                Swal.fire({ icon: 'error', title: 'Bạn cần đăng nhập!', confirmButtonText: 'Đăng nhập' }).then(() => navigate('/login'));
                return;
            }
            const response = await axios.post(`${ip}/wishlist`, { user_id: user.id, product_id: productId });
            if (response.data?.message === "Product already in wishlist") {
                Swal.fire({ toast: true, icon: 'warning', position: "top-end", title: 'Đã có trong yêu thích', timer: 2000 });
            } else {
                Swal.fire({ toast: true, position: "top-end", icon: 'success', title: 'Đã thêm vào yêu thích', timer: 2000 });
                setFavoriteProducts(prev => prev.includes(productId) ? prev : [...prev, productId]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getFilteredProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            let url = `${ip}/products?page=${pageNumber}&limit=${perPage}`;
            if (brandFilter) url = `${ip}/products/brand/${encodeURIComponent(brandFilter)}?page=${pageNumber}&limit=${perPage}`;
            else if (categoryFilter) url = `${ip}/products/category/${encodeURIComponent(categoryFilter)}?page=${pageNumber}&limit=${perPage}`;

            const response = await axios.get(url);
            if (response.data) {
                let productData = response.data.data || [];
                const pagination = response.data.meta?.pagination || {};

                if (priceRange.min !== '' || priceRange.max !== '') {
                    const min = priceRange.min === '' ? 0 : parseInt(priceRange.min);
                    const max = priceRange.max === '' ? Infinity : parseInt(priceRange.max);
                    productData = productData.filter(p => p.price >= min && p.price <= max);
                }

                if (sortOption === 'price-asc') productData.sort((a, b) => a.price - b.price);
                else if (sortOption === 'price-desc') productData.sort((a, b) => b.price - a.price);
                else if (sortOption === 'newest') productData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

                setCurrentPage(pagination.page || 1);
                setTotalPages(pagination.pageCount || 1);

                const updated = productData.map(p => ({
                    ...p,
                    imageUrl: p.image ? `${ip}/uploads/${p.image}` : "/images/default-placeholder.jpg"
                }));
                setProducts(updated);
            }
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [brandFilter, categoryFilter, priceRange, sortOption, perPage]);

    useEffect(() => {
        getFilteredProducts(1);
    }, [getFilteredProducts]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) getFilteredProducts(page);
    };

    const handleBrandChange = (brand) => {
        setBrandFilter(brand === brandFilter ? '' : brand);
        setCategoryFilter('');
        setCurrentPage(1);
        if (isMobile) setShowFilter(false);
    };

    const handleCategoryChange = (category) => {
        setCategoryFilter(category === categoryFilter ? '' : category);
        setBrandFilter('');
        setCurrentPage(1);
        if (isMobile) setShowFilter(false);
    };

    const applyPriceFilter = () => {
        setPriceRange({ min: tempPriceRange.min, max: tempPriceRange.max });
        if (isMobile) setShowFilter(false);
    };

    const FilterSidebar = () => (
        <div className="filter-section">
            <div className="filter-block">
                <h4>Danh mục</h4>
                <ul className="filter-list">
                    {categories.map(c => (
                        <li key={c.id}>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="category" id={`cat-${c.id}`} checked={categoryFilter === c.name} onChange={() => handleCategoryChange(c.name)} />
                                <label className="form-check-label" htmlFor={`cat-${c.id}`}>{c.name}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="filter-block">
                <h4>Thương hiệu</h4>
                <ul className="filter-list">
                    {brands.map(b => (
                        <li key={b.id}>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="brand" id={`brd-${b.id}`} checked={brandFilter === b.name} onChange={() => handleBrandChange(b.name)} />
                                <label className="form-check-label" htmlFor={`brd-${b.id}`}>{b.name}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="filter-block border-0">
                <h4>Khoảng giá</h4>
                <div className="price-filter">
                    <input type="number" className="form-control form-control-sm mb-2" placeholder="Từ" value={tempPriceRange.min} onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })} />
                    <input type="number" className="form-control form-control-sm mb-2" placeholder="Đến" value={tempPriceRange.max} onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })} />
                    <Button variant="primary" size="sm" className="w-100" onClick={applyPriceFilter}>Áp dụng</Button>
                </div>
            </div>
        </div>
    );

    const renderGridProducts = () => (
        <div className="row g-3 px-2">
            {products.length > 0 ? (
                products.map((item) => (
                    <div className={isMobile ? "col-6" : "col-xl-2 col-lg-3 col-md-4"} key={item.id}>
                        <Card className="h-100 border-0 shadow-sm position-relative overflow-hidden product-card-grid">
                            <div className="discount-badge">-9%</div>
                            <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                <i className={favoriteProducts.includes(item.id) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                            </div>
                            <Link to={`/chi-tiet-san-pham/${item.id}`} className="p-3 d-block text-center">
                                <Card.Img src={item.imageUrl} alt={item.name} style={{ height: isMobile ? "120px" : "160px", objectFit: "contain" }} />
                            </Link>
                            <Card.Body className="d-flex flex-column p-2">
                                <div className="official-badge mb-1">Chính Hãng 100%</div>
                                <p className="text_name mb-2" style={{ fontSize: "14px", height: "40px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.name}</p>
                                <div className="mt-auto">
                                    <hr className="my-1" />
                                    <p className="text_price m-0 fw-bold" style={{ color: "#D10024", fontSize: "15px" }}>{formatCurrency(item.price)}</p>
                                    <hr className="my-1" />
                                    <p className="text_plus mb-0" style={{ fontSize: "10px", color: "#28a745" }}>Tặng sạc cáp nhanh 25w</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))
            ) : (
                <div className="text-center py-5 w-100 text-muted">Không có sản phẩm nào</div>
            )}
        </div>
    );

    const renderListProducts = () => (
        <div className="list-products px-2">
            {products.map((item) => (
                <div className="list-product-item border-0 shadow-sm mb-3 position-relative" key={item.id}>
                    <div className="row align-items-center g-0">
                        <div className="col-4 col-md-3 p-3">
                            <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                <img src={item.imageUrl} className="img-fluid" alt={item.name} style={{ maxHeight: "150px", objectFit: "contain" }} />
                            </Link>
                        </div>
                        <div className="col-8 col-md-9 p-3">
                            <h5 className="mb-2 fw-bold text-dark" style={{ fontSize: isMobile ? "15px" : "18px" }}>{item.name}</h5>
                            <div className="text-muted small mb-1">Thương hiệu: {item.brand || "Khác"}</div>
                            <div className="fw-bold mb-2" style={{ color: "#e53935", fontSize: "18px" }}>{formatCurrency(item.price)}</div>
                            <div className="d-none d-md-block text-success small mb-3">Tặng sạc cáp nhanh 25w trị giá 250k</div>
                            <div className="d-flex align-items-center gap-3">
                                <button className={`btn-add-to-wishlist border-0 bg-light rounded-pill px-3 py-1 small ${favoriteProducts.includes(item.id) ? 'text-danger fw-bold' : ''}`} onClick={() => handleAddToWishlist(item.id)}>
                                    <i className={favoriteProducts.includes(item.id) ? "fas fa-heart me-1" : "far fa-heart me-1"}></i>{isMobile ? "" : "Thêm vào yêu thích"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading && currentPage === 1 && products.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <img style={{ width: "80px" }} src="./img/loading-gif-png-5.gif" alt="Loading" />
            </div>
        );
    }

    return (
        <div className="pb-5" style={{ backgroundColor: "#f5f5f7" }}>
            <ComeBack />
            <div className="AllProduct mt-3">
                <ToastContainer />

                {/* 3 Banners - Scrollable on mobile */}
                <div className="bannerAll container-fluid px-0 px-md-3">
                    <div className={isMobile ? "modern-scroll-wrapper" : "row g-3 w-100 mx-0"}>
                        {banner.map((item) => (
                            <div className={isMobile ? "modern-scroll-item" : "col-4"} key={item.id} style={isMobile ? { width: "85%", flexShrink: 0 } : {}}>
                                <img src={item.img} className="img-fluid rounded-3 shadow-sm" alt="Banner" style={{ width: "100%", height: "auto" }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container mt-4">
                    <div className="row g-4">
                        {/* Sidebar - Hidden on mobile */}
                        {!isMobile && (
                            <div className="col-lg-2">
                                <FilterSidebar />
                            </div>
                        )}

                        <div className={isMobile ? "col-12" : "col-lg-10"}>
                            {/* Toolbar */}
                            <div className="product-toolbar shadow-sm border-0 d-flex flex-wrap align-items-center justify-content-between mb-4 p-2 rounded-3 bg-white">
                                <div className="d-flex align-items-center gap-2">
                                    {isMobile && (
                                        <Button variant="outline-dark" size="sm" onClick={() => setShowFilter(true)} className="d-flex align-items-center gap-1">
                                            <FaFilter size={14} /> Lọc
                                        </Button>
                                    )}
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 small text-muted d-none d-sm-inline">Sắp xếp:</span>
                                        <select className="form-select form-select-sm border-0 bg-light" style={{ minWidth: isMobile ? "120px" : "180px" }} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                            <option value="default">Mặc định</option>
                                            <option value="price-asc">Giá: Thấp đến Cao</option>
                                            <option value="price-desc">Giá: Cao đến Thấp</option>
                                            <option value="newest">Mới nhất</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <button className={`btn btn-sm rounded-2 ${viewMode === 'grid' ? 'btn-primary' : 'btn-light border text-muted'}`} onClick={() => setViewMode('grid')}>
                                        <Grid size={18} />
                                    </button>
                                    <button className={`btn btn-sm rounded-2 ${viewMode === 'list' ? 'btn-primary' : 'btn-light border text-muted'}`} onClick={() => setViewMode('list')}>
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Product List */}
                            <div className="min-vh-50">
                                {viewMode === 'grid' ? renderGridProducts() : renderListProducts()}
                                {loading && <div className="text-center mt-3"><img style={{ width: "40px" }} src="./img/loading-gif-png-5.gif" alt="Loading" /></div>}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pageNumber mt-5">
                                    <button onClick={() => goToPage(1)} disabled={currentPage === 1} id="firstPage">«</button>
                                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} id="first">‹</button>
                                    <span id="page" className="border-0 bg-transparent text-dark mx-2"> {currentPage} / {totalPages} </span>
                                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} id="firstPage">›</button>
                                    <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} id="first">»</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Offcanvas */}
                <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="start" style={{ width: "280px" }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="fw-bold">Bộ lọc</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0">
                        <FilterSidebar />
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AllProduct;