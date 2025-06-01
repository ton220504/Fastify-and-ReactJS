import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { CiDeliveryTruck } from "react-icons/ci";
import Swal from "sweetalert2";
import "../../scss/Delivery.scss";
import { Link } from "react-router-dom";

const TabFinish = (props) => {
    const { show, handleShow, handleClose } = props;
    const [orderuserid, setOrderUserid] = useState([]);
    const [error, setError] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null); // ✅ Lưu sản phẩm thay vì ID
    const [product, setProduct] = useState({}); // Store product details

    useEffect(() => {
        const getOrderByUserId = async () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user"));

                if (!user) {
                    setError("Không tìm thấy thông tin người dùng.");
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/orders/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const deliveredOrders = response.data.filter(order => order.status === "DELIVERED");
                setOrderUserid(deliveredOrders);
            } catch (error) {
                console.error("Lỗi khi gọi API đơn hàng:", error);
                setError("Không thể tải dữ liệu đơn hàng.");
            }
        };

        getOrderByUserId();
    }, []);

    // 🛠 Xử lý đánh giá sản phẩm
    const handleDanhgia = async () => {
        if (!selectedProduct) return; // Không có sản phẩm thì không làm gì cả

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Bạn cần đăng nhập để đánh giá sản phẩm.",
                });
                return;
            }

            if (!reviewContent.trim()) {
                Swal.fire({
                    icon: "warning",
                    title: "Chưa nhập đánh giá!",
                    text: "Vui lòng nhập nội dung đánh giá trước khi gửi.",
                });
                return;
            }

            await axios.post(
                "http://localhost:3000/api/reviews",
                {
                    user_id: user.id,
                    content: reviewContent,
                    product_id: selectedProduct.id,
                }
            );

            Swal.fire({
                icon: "success",
                title: "Đánh giá đã được gửi!",
                showConfirmButton: false,
                timer: 1500,
            });

            setReviewContent(""); // Reset input
            setSelectedProduct(null); // Reset sản phẩm
            handleClose(); // Đóng modal
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Có lỗi xảy ra. Vui lòng thử lại.",
            });
        }
    };
    useEffect(() => {
        if (orderuserid.length > 0) {
            orderuserid.forEach(order => {
                order.items.forEach(item => {
                    if (item.product_id) {
                        fetchProductDetails(item.product_id);
                    }
                });
            });
        }
    }, [orderuserid]);


    const fetchProductDetails = async (product_id) => {
        if (!product_id) return; // Nếu productId không tồn tại, không gọi API
        if (!product[product_id]) { // Chỉ fetch nếu sản phẩm chưa có

            try {
                const response = await axios.get(`http://localhost:3000/api/products/${product_id}`);
                const product = response.data;
                product.image = `http://127.0.0.1:3000/uploads/${product.image}`;
                setProduct(prevProducts => ({
                    ...prevProducts,
                    [product_id]: response.data
                }));

            } catch (error) {
                console.error("Lỗi khi gọi API sản phẩm:", error);
            }
        }
    };
    return (
        <>
            <div className="font-sans mb-3">
                <div className="bg-gray-100 mt-3">
                    <input type="text" placeholder="Tìm kiếm đơn hàng..." className="w-full p-2 border border-gray-300 rounded form-control" />
                </div>

                <div>
                    {orderuserid.length > 0 ? (
                        orderuserid.map((order, orderIndex) => (
                            <div className="bg-white p-4 mt-2 shadow-sm rounded" key={`order-${orderIndex}`}>
                                {/* Tiêu đề đơn hàng */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="text-danger fw-bold fs-5">Đơn hàng thứ {orderIndex + 1}</p>
                                    <div className="d-flex align-items-center">
                                        <CiDeliveryTruck className="text-success fs-4" />
                                        <span className="ms-2 me-2 text-success ">Giao hàng thành công</span>
                                    </div>
                                </div>
                                <hr />

                                {/* Danh sách sản phẩm */}
                                {order?.items?.map((item, itemIndex) => {
                                    const pro = product[item.product_id];
                                    return (
                                        <div className="d-flex align-items-center my-3" key={`item-${itemIndex}`}>
                                            {pro ? (
                                                <>
                                                    <img
                                                        src={`http://127.0.0.1:3000/uploads/${item.image}`}
                                                        alt={`Ảnh sản phẩm ${item.product_id}`}
                                                        className="rounded"
                                                        style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                    />
                                                    <div className="ms-3">
                                                        <p className="fw-bold mb-1">{pro.name}</p>
                                                        <p className="mb-1">Số lượng: {item.quantity}</p>
                                                        <p className="mb-1">Giá: {pro.price.toLocaleString()} VND</p>
                                                        <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                                                    </div>
                                                    {/* 🛠 Nút đánh giá chỉ chọn đúng sản phẩm */}
                                                    <button
                                                        className="btnDanhgia mt-auto p-2 border rounded"
                                                        onClick={() => {
                                                            setSelectedProduct({
                                                                ...pro,
                                                                image: item.image // Ghi đè image bằng ảnh từ đơn hàng
                                                            });
                                                            handleShow();
                                                        }}

                                                    >
                                                        Đánh giá
                                                    </button>
                                                    <Link className="mt-auto" to={`/chi-tiet-san-pham/${pro.id}`}>
                                                        <button className="btnMualai  p-2 border rounded">
                                                            Mua lại
                                                        </button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <p>Đang tải sản phẩm...</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <div className="bg-img"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🛠 Modal hiển thị sản phẩm được chọn */}
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedProduct ? (
                        <div className="d-flex align-items-center my-3">
                            <img
                                src={`http://127.0.0.1:3000/uploads/${selectedProduct.image}`}
                                alt={selectedProduct.name}
                                className="rounded"
                                style={{ width: '70px', height: '70px', marginRight: '10px' }}
                            />
                            <div className="ms-3">
                                <p className="fw-bold mb-1">{selectedProduct.name}</p>
                                <p className="mb-1">Giá: {selectedProduct.price.toLocaleString()} VND</p>
                            </div>
                        </div>
                    ) : (
                        <p>Không tìm thấy sản phẩm!</p>
                    )}

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Viết đánh giá</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Trở lại
                    </Button>
                    <Button variant="primary" onClick={handleDanhgia}>
                        Đánh giá
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TabFinish;
