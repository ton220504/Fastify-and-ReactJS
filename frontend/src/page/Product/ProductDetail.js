import { FaShoppingCart } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ComeBack from "../../Components/ComeBack";
import "../../scss/ProductDetail.scss";
import numeral from "numeral";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { ip } from "../../api/Api";




const ProductDetail = () => {
    const [activeTab, setActiveTab] = useState('des');
    const [isShow, setIsShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const [cartLoading, setCartLoading] = useState(false);
    const [variations, setVariations] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [mainProductName, setMainProductName] = useState("");
    const [reviews, setReviews] = useState([]);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const [outOfStock, setOutOfStock] = useState(false);
    const imageInitialized = useRef(false);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/products/${id}`);
                const productData = response.data;

                if (productData) {
                    const mainProductName = extractProductName(productData.name);
                    setProduct(productData); // nhớ setProduct để dùng bên dưới

                    const isOutOfStock = productData.stockQuantity === 0;
                    setOutOfStock(isOutOfStock); // thêm state này

                    fetchImageAndUpdateProduct(productData);
                    fetchResults(mainProductName);
                    fetchReviews();
                }

            } catch (error) {
                console.error("Lỗi khi gọi API sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    ///lấy đánh giá sản phẩm
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reviews/product/${id}`);
            const dataReviews = response.data;
            setReviews(dataReviews);
            //console.log(dataReviews);
        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }

    // Hàm lọc tên sản phẩm chính xác
    const extractProductName = (fullName) => {
        return fullName
            .replace(/\d+GB/g, '') // Loại bỏ dung lượng (128GB, 256GB, ...)
            .replace(/\s*\|\s*Chính hãng VN\/A/g, '') // Loại bỏ phần "| Chính hãng VN/A"
            .trim(); // Xóa khoảng trắng dư thừa
    };

    // Hàm fetch ảnh cho 1 sản phẩm
    const fetchImageAndUpdateProduct = async (data) => {
        if (!data || data.length === 0) return;

        const updatedProducts = product => {
            const imageUrl = product.image
                ? `http://127.0.0.1:3000/uploads/${product.image}`
                : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có

            return { ...product, imageUrl };
        };

        setProduct(updatedProducts);
    };
    //ảnh liên quan
    useEffect(() => {
        imageInitialized.current = false; // Reset khi chuyển sản phẩm
    }, [product?.id]);

    useEffect(() => {
        if (!product) return;
        if (product.images && product.images.length > 0 && !imageInitialized.current) {
            const mappedVariations = product.images.map((img, index) => ({
                imageUrl: `http://127.0.0.1:3000/uploads/${img.url}`,
                color: img.color,
                price: img.price,
                index
            }));

            setVariations(mappedVariations);
            setSelectedIndex(0);
            setProduct(prev => ({
                ...prev,
                imageUrl: mappedVariations[0].imageUrl
            }));

            imageInitialized.current = true;
        }

        if ((!product.images || product.images.length === 0) && !imageInitialized.current) {
            setVariations([]);
            setSelectedIndex(null);
            setProduct(prev => {
                const fallbackImage = prev?.image
                    ? `http://127.0.0.1:3000/uploads/${prev.image}`
                    : "/images/default-placeholder.jpg";

                return {
                    ...(prev || {}),
                    imageUrl: fallbackImage
                };
            });

            imageInitialized.current = true;
        }
    }, [product]);

    const fetchResults = async (mainProductName) => {

        try {
            const response = await axios.get(
                `http://127.0.0.1:3000/api/products/search`,
                {
                    params: {
                        searchTerm: `${mainProductName}`,
                        page: 1,
                        limit: 10
                    }
                }
            );
            const products = response.data?.data || [];

            // Gắn link ảnh
            const updatedResults = products.map((product) => ({
                ...product,
                imageUrl: product.image
                    ? `http://127.0.0.1:3000/uploads/${product.image}`
                    : "/images/default-placeholder.jpg"
            }));

            setRelatedProducts(updatedResults);
        } catch (error) {
            console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
            setRelatedProducts([]);
        }
    };
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
    useEffect(() => {
        getUserData();

    }, []);
    
    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id || !token) {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập để mua sản phẩm này!',
                confirmButtonText: 'Đăng nhập ngay'
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        if (!product || quantity > product.stockQuantity) {
            Swal.fire({
                icon: 'error',
                toast: true,
                position: "top-end",
                title: 'Số lượng không đủ',
                text: `Chỉ còn ${product?.stockQuantity ?? 0} sản phẩm trong kho.`,
            });
            return;
        }

        const selectedVariation = variations[selectedIndex];

        const payload = {
            user_id: user.id,
            items: [
                {
                    product_id: product.id,
                    quantity,
                    price: selectedVariation?.price ?? product.price,
                    image: selectedVariation?.imageUrl ?? product.imageUrl,
                    color: selectedVariation?.color ?? "Không rõ"
                }
            ]
        };

        try {
            // ✅ Thêm sản phẩm hiện tại vào giỏ hàng
            await axios.post("http://127.0.0.1:3000/api/carts", payload);

            // ✅ Lấy toàn bộ sản phẩm trong giỏ hàng
            const cartRes = await axios.get(`http://127.0.0.1:3000/api/carts/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const cartItems = cartRes.data?.items || [];
            console.log(cartItems);
            if (cartItems.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Giỏ hàng trống',
                    text: 'Không có sản phẩm để thanh toán.'
                });
                return;
            }

            // ✅ Lấy thông tin user
            const userItems = {
                username: user.username,
                email: user.email,
                phone: user.phone
            };

            // ✅ Tính tổng tiền
            const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // ✅ Điều hướng tới trang thanh toán với toàn bộ giỏ hàng
            navigate('/thanh-toan', {
                state: {
                    selectedItems: cartItems.map(item => ({
                        id: item.product_id,
                        name: item?.product_name || 'Không rõ',
                        imageUrl: `http://127.0.0.1:3000/uploads/${item.image}`,
                        price: item.price,
                        quantity: item.quantity,
                        color: item.color,
                        fromCart: true,
                        cartItemId: item.id,
                    })),
                    totalAmount,
                    userItems
                }
            });

        } catch (err) {
            console.error("Lỗi khi xử lý thanh toán:", err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi khi xử lý thanh toán',
                text: 'Vui lòng thử lại sau.'
            });
        }
    };


    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }
    if (!product) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };
    const handleShowmore = () => {
        setIsShow(!isShow)
    }
    const handleAddToCart = async () => {
        try {
            setCartLoading(true);

            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.id || !token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    navigate('/login');
                });
                return;
            }
            const selectedVariation = variations[selectedIndex];
            const payload = {
                user_id: user.id,
                items: [
                    {
                        product_id: product.id,
                        quantity: quantity,
                        // price: product.price,
                        // image: product.imageUrl
                        price: selectedVariation?.price ?? product.price,
                        image: selectedVariation?.imageUrl ?? product.imageUrl,
                        color: selectedVariation?.color ?? "Không rõ"
                    }
                ]
            };
            console.log(payload);
            const response = await axios.post(
                "http://127.0.0.1:3000/api/carts",
                payload // <-- body mới cần truyền
            );

            if (response.status === 201 || response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm vào giỏ hàng thành công',
                    confirmButtonText: 'OK'
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            Swal.fire({
                icon: 'error',
                title: 'Đã xảy ra lỗi!',
                text: 'Vui lòng thử lại sau.'
            });
        } finally {
            setCartLoading(false);
        }
    };
    const handleImageChange = (direction) => {
        setSelectedIndex((prevIndex) => {
            let newIndex;
            if (direction === 'prev') {
                newIndex = prevIndex === 0 ? variations.length - 1 : prevIndex - 1;
            } else {
                newIndex = prevIndex === variations.length - 1 ? 0 : prevIndex + 1;
            }

            setProduct(prev => ({
                ...prev,
                imageUrl: variations[newIndex].imageUrl,
                price: variations[newIndex].price
            }));

            // Scroll to thumbnail
            const scrollContainer = scrollRef.current;
            if (scrollContainer) {
                const thumbnail = scrollContainer.children[newIndex];
                if (thumbnail) {
                    thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }

            return newIndex;
        });
    };
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Tăng tốc nếu muốn
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    return (
        <>
            <ComeBack />
            <div className="productdetail container">
                <div className='detail row'>
                    <div className="col-md-3 product-img">
                        {/* <img className='img' src={`../../../img/${JSON.parse(product.photo)[0]}`} /> */}
                        <div className="product-images" style={{ position: 'relative' }}>
                            <button
                                className="image-nav-btn left"
                                onClick={() => handleImageChange('prev')}
                                disabled={selectedIndex === 0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                </svg>
                            </button>
                            <Link to={`/chi-tiet-san-pham/${product.id}`}>
                                <Card.Img
                                    className="product-image"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                                />
                                {outOfStock && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '5px',
                                        left: '10px',
                                        backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                        color: 'white',
                                        padding: '5px 10px',
                                        fontWeight: 'bold',
                                        borderRadius: '5px'
                                    }}>
                                        HẾT HÀNG
                                    </div>
                                )}
                            </Link>
                            <button
                                className="image-nav-btn right"
                                onClick={() => handleImageChange('next')}
                                disabled={selectedIndex === variations.length - 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>
                            <div className="related-images-wrapper mt-2">
                                <div className="related-images-scroll" ref={scrollRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}>
                                    {variations.map((variation, index) => (
                                        <img
                                            key={index}
                                            src={variation.imageUrl}
                                            alt={`Ảnh ${index}`}
                                            className={`thumbnail-image ${selectedIndex === index ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedIndex(index);
                                                setProduct(prev => ({
                                                    ...prev,
                                                    imageUrl: variation.imageUrl,
                                                    price: variation.price
                                                }));
                                            }}
                                            onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                                        />
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 product-form'>

                        {/* Header Section */}
                        <div className="product-header">
                            <h1>{product.name}</h1>
                            <span>Thương hiệu: <strong>{product.brand}</strong></span>
                            {outOfStock ? (
                                <span >Tình trạng: <strong style={{ color: 'red' }}>Hết hàng</strong></span>
                            ) : (
                                <span >Tình trạng: <strong style={{ color: 'green' }}>Còn hàng</strong></span>
                            )}

                        </div>

                        {/* Price and Storage Options */}
                        <div className="product-price">
                            <p>Giá: <a>{formatCurrency(product.price)}</a></p>
                            {/* <span>Giá cũ: <strike className="price-old">10.000.000đ</strike></span> */}
                        </div>

                        <div className="quantity-selection">
                            <span>Số lượng</span>

                            <div className="money">
                                <button id='btn' onClick={decrementQuantity} >-</button>
                                <input id='numberquantity' className='text-center' value={quantity} readOnly style={{ width: "30px" }} />
                                <button id='btn' onClick={incrementQuantity} >+</button>
                            </div>
                        </div>
                        <div className="quantity-selection">
                            <span>Màu sắc:</span>
                        </div>

                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {variations.map((variation, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        setProduct(prev => ({
                                            ...prev,
                                            imageUrl: variation.imageUrl,
                                            price: variation.price,
                                            color: variation.color
                                        }));
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "160px",
                                        border: selectedIndex === index ? "2px solid #503eb6" : "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "4px 6px",
                                        backgroundColor: "#f9f9f9",
                                        cursor: "pointer"
                                    }}
                                >
                                    <img
                                        src={variation.imageUrl}
                                        alt={`color-${index}`}
                                        style={{ height: "35px", width: "35px", marginRight: "10px", borderRadius: "4px" }}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ color: "#555" }}>{variation.color ?? "Không màu"}</div>
                                        <span style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>{formatCurrency(variation.price)}</span>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Call-to-Action Buttons */}
                        <div className="action-buttons">

                            <div className="btn-2">
                                <button
                                    className="themgiohang"
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || outOfStock}
                                >
                                    {outOfStock ? "Hết hàng" : cartLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                </button>
                                <button className="mua-tra-gop" style={{ backgroundColor: "#503eb6", color: "white" }} disabled={outOfStock} onClick={handleCheckout} > Mua ngay</button>
                            </div>
                        </div>
                        <img style={{ height: "auto", maxWidth: "565px", borderRadius: "7px", marginTop: "7px" }} src="https://clickbuy.com.vn/uploads/media/657-LHKNd.jpg" />

                    </div>
                    <div className='col-md-3 form-policy'>
                        <div className="sidebar">
                            {/* Chính sách của chúng tôi */}
                            <div className="policies">
                                <div className="section-title">Chính Sách Của Chúng Tôi</div>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_1.png?1719291840576" />
                                    <span style={{ marginLeft: '8px' }}>Miễn phí vận chuyển tại TP.HCM</span>
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_2.png?1719291840576" />
                                    <span style={{ marginLeft: '8px' }}>Bảo hành chính hãng toàn quốc </span>
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_3.png?1719291840576" />
                                    <span style={{ marginLeft: '8px' }}>Cam kết chính hãng 100%</span>
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_4.png?1719291840576" />
                                    <span style={{ marginLeft: '8px' }}>1 đổi 1 nếu sản phẩm lỗi</span>
                                </p>
                            </div>

                            {/* Có thể bạn thích */}
                            <div className="recommendations">
                                <div className="section-title">Có Thể Bạn Thích</div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="describe row">
                    <div className="tab">
                        <Link onClick={() => setActiveTab("des")}>Mô tả sản phẩm</Link>
                        <Link onClick={() => setActiveTab("policy")}>Chính sách đổi trả</Link>
                    </div>
                    {activeTab === "des" &&
                        (
                            <div className="des col-9 m-3">
                                <span>
                                    Nguồn gốc {product.description} chính hãng<br />
                                    {product.description} nói riêng và toàn bộ sản phẩm công nghệ nói chung
                                    được Di Động Thông Minh nhập trực tiếp từ những nhà phân phối lớn hàng đầu Việt Nam như
                                    FPT Trading, Dầu Khí, Digiworld hay Viettel,...
                                </span><br />
                                {isShow && (
                                    <span>
                                        Chính vì vậy, khi mua hàng tại hệ thống, quý khách hoàn toàn có thể yên tâm về chất lượng cũng như chế độ bảo hành chính hãng.<br />
                                        Không chỉ vậy, Di Động Thông Minh còn cam kết sản phẩm nguyên seal chính hãng và dễ dàng check thông tin IMEI trên trang chủ Apple để kiểm chứng.<br />
                                        Đánh giá thiết kế {product.description} : Mới mẻ, thời thượng<br />
                                        {product.description} năm nay có màu mới tím mới khá lạ mắt. Còn lại, về hình thức thì không khác biệt gì nhiều so với iPhone 13 Pro Max với mặt lưng kính, phần khung viền thiết kế vuông vức và được bo cong bốn góc.<br />
                                        Bên khung cạnh phải có phím nguồn, còn khung cạnh trái có cần gạt rung, phím chỉnh âm lượng và khe sim, thiết bị vẫn có có cổng Lightning và loa ngoài.<br />
                                        Đánh giá màn hình {product.description}: Ấn tượng với Dynamic Island kỳ diệu
                                        Màn hình {product.description} mới có kích thước 6.7” cùng tấm nền OLED với độ phân giải Full HD+ (1290 x 2796 pixel) cho chất lượng hiển thị cực đã mắt.<br />
                                    </span>
                                )}
                                {/* <span>{product.description}</span> */}
                                <div className="bg-cl-active"></div>
                                <a className="showmore" onClick={() => handleShowmore()}>
                                    {isShow ? "Thu gọn" : "Xem thêm"}
                                </a><br />


                            </div>
                        )

                    }
                    {activeTab === "policy" &&
                        (
                            <div className="chinhsach col-9 m-3">
                                + Sản phẩm lỗi, hỏng do quá trình sản xuất hoặc vận chuyện<br />
                                + Nằm trong chính sách đổi trả sản phẩm của Bean<br />
                                + Sản phẩm còn nguyên tem mác không bị rớt vỡ, vô nước<br />
                                + Thời gian đổi trả nhỏ hơn 15 ngày kể từ ngày nhận hàng<br />
                                + Chi phí bảo hành về sản phẩm, vận chuyển khách hàng chịu chi phí
                                Điều kiện đổi trả hàng<br />
                                Điều kiện về thời gian đổi trả: trong vòng 07 ngày kể từ khi nhận được hàng và phải liên hệ gọi ngay cho chúng tôi theo số điện thoại trên để được xác nhận đổi trả hàng.
                                Điều kiện đổi trả hàng:<br />
                                - Sản phẩm gửi lại phải còn nguyên đai nguyên kiện<br />
                                - Phiếu bảo hành (nếu có) và tem của công ty trên sản phẩm còn nguyên vẹn.<br />
                                - Sản phẩm đổi/ trả phải còn đầy đủ hộp, giấy hướng dẫn sử dụng và không bị trầy xước, bể.<br />
                                - Quý khách chịu chi phí vận chuyển, đóng gói, thu hộ tiền, chi phí liên lạc tối đa tương đương 10% giá trị đơn hàng.
                            </div>
                        )
                    }
                </div>
                {/* Additional Information and Recommendations */}
                <div>
                    <p className="mt-3 " style={{ fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Sản phẩm liên quan</p>
                    <div className="my-deal-phone container p-3 mt-3">
                        <section className="content container">
                            <div className="content-deal row p-2 justify-content-start">
                                {/* Lặp qua danh sách sản phẩm và hiển thị */}
                                {relatedProducts.length > 0 ? (
                                    relatedProducts.map((item) => (
                                        <Card className="box col-2 m-2 item-cart" key={item.id}>
                                            {/* <div className="discount-badge">-9%</div> Phần giảm giá */}
                                            <div className="favorite-icon" >
                                                {/* Đổi icon dựa trên trạng thái yêu thích */}
                                                {/* <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i> */}
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
                        </section>
                    </div>

                </div>
                <div className="comments mt-4 form-control">
                    <p className="mt-3 " style={{ fontStyle: "italic", fontWeight: "600", fontSize: "20px", fontWeight: "bold" }}>Đánh giá sản phẩm({reviews.length})</p>
                    {reviews.map((re, index) => (
                        <>
                            <div className="comment my-2  ">
                                <strong style={{ marginRight: "25px" }}>{re.user.username}</strong>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                    <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                    <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                </svg>
                                <small>
                                    {new Date(re.created_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </small>
                                <p className="contentReview border p-2 rounded">{re.content}</p>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    );

}

export default ProductDetail;
