import { useEffect, useState } from "react";
import "../../scss/Delivery.scss"
import { CiDeliveryTruck } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import numeral from "numeral";
import { ip } from "../../api/Api";



const TabTrans = (props) => {

    const { show, products, handleClose, handleShow } = props
    const [orderuserid, setOrderUserid] = useState([]);
    const [product, setProduct] = useState({}); // Store product details

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const handleDanhgia = () => {
        handleClose();
        Swal.fire({
            icon: 'success',
            title: 'Cảm ơn bạn đã đánh giá!',
            confirmButtonText: 'OK'
        });
        //return 0;

    }

    const [error, setError] = useState(null);

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

                const pendingOrders = response.data.filter(order => order.status === "PAID");

                setOrderUserid(pendingOrders);
            } catch (error) {
                console.error("Lỗi khi gọi API đơn hàng:", error);
                setError("Không thể tải dữ liệu đơn hàng.");
            }
        };

        getOrderByUserId();
    }, []);
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
                    <input type="text" placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm" className="w-full p-2 border border-gray-300 rounded form-control" />
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
                                        <span className="ms-2 me-2 border-end text-success">Giao hàng nhanh |</span>
                                        <span className="text-danger fw-bold">Tiết kiệm</span>
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
                                                        alt={`Ảnh sản phẩm ${item.name}`}
                                                        className="rounded"
                                                        style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                    />
                                                    <div className="ms-3">
                                                        <p className="fw-bold mb-1">{pro.name}</p>
                                                        <p className="mb-1">Số lượng: {item.quantity}</p>
                                                        <p className="mb-1">Giá: {pro.price.toLocaleString()} VND</p>
                                                        <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>Đang tải sản phẩm...</p>
                                            )}
                                        </div>
                                    );
                                })}

                                <hr />

                                {/* Tổng tiền */}
                                <div className="d-flex justify-content-end mb-3">
                                    <span>Thành tiền: <b className="text-primary">{order?.total_price?.toLocaleString()} VND</b></span>
                                </div>

                                {/* Thông tin đánh giá và trạng thái đơn hàng */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="danh-gia">
                                        Đánh giá sản phẩm trước <span className="text-danger">22-05-2025</span>
                                        <br />
                                        <span className="text-danger">Đánh giá ngay và nhận 200 Xu</span>
                                    </div>
                                    
                                </div>
                            </div>
                        ))


                    ) : (
                        <div className="no-products">
                            <div className="bg-img"></div>
                        </div>
                    )}

                </div>
            </div>
            
        </>


    )
}

export default TabTrans;