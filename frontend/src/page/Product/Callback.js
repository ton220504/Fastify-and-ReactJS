// import React from 'react'
// import { Link } from 'react-router-dom'

// const Callback = () => {
//   return (
//     <div style={{height:"300px"}}>
//         <h2>Đặt hàng thành công !</h2>
//         <p>Tiếp tục mua hàng</p>
//         <Link to={"/ca-nhan"}><p>Xem thông tin đơn hàng</p></Link>
//     </div>
//   )
// }

// export default Callback
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Callback = () => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Callback useEffect run");

        const processOrder = async () => {
            console.log("Bắt đầu xử lý đơn hàng MoMo");

            const orderData = JSON.parse(localStorage.getItem("orderInfo"));
            const isProcessed = localStorage.getItem("orderProcessed");

            if (!orderData || isProcessed === "true") {
                return; // Đã xử lý rồi hoặc không có đơn hàng
            }

            try {
                // ✅ Đánh dấu đã xử lý ngay từ đầu để chống double submit
                localStorage.setItem("orderProcessed", "true");

                // 1. Gửi đơn hàng
                const res = await axios.post(`http://127.0.0.1:3000/api/orders`, orderData);

                // 2. Trừ tồn kho
                await Promise.all(orderData.items.map(item =>
                    axios.put(`http://localhost:3000/api/products/${item.product_id}/stock`, {
                        stock_quantity: item.quantity
                    })
                ));

                // 3. Xóa khỏi giỏ hàng nếu có
                const cartItemIds = orderData.items.reduce((acc, item) => {
                    if (item.fromCart && item.cartItemId) {
                        acc.push(item.cartItemId);
                    } else if (item.fromCart && !item.cartItemId) {
                        console.warn("⚠️ item.fromCart nhưng thiếu cartItemId:", item);
                    }
                    return acc;
                }, []);

                if (cartItemIds.length > 0) {
                    await Promise.all(
                        cartItemIds.map(id =>
                            axios.delete(`http://127.0.0.1:3000/api/cartsItem/${id}`)
                                .catch(err => {
                                    console.error(`❌ Lỗi xóa cartItem ${id}`, err);
                                })
                        )
                    );
                    console.log("🗑️ Đã xóa các item khỏi giỏ hàng");
                }

                // 4. Xóa localStorage tạm thời
                localStorage.removeItem("orderInfo");
                localStorage.removeItem("orderProcessed");

                // 5. Hiển thị thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Đặt hàng thành công!',
                    text: 'Đơn hàng sẽ được giao trong 2-3 ngày tới!',
                    showCancelButton: true,
                    confirmButtonText: 'Tiếp tục mua hàng',
                    cancelButtonText: 'Thoát'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/tat-ca-san-pham");
                    } else {
                        navigate("/");
                    }
                });
            } catch (error) {
                console.error("Lỗi khi xử lý đơn hàng MoMo:", error);
            }
        };

        processOrder();
    }, [navigate]);


    return (
        <div style={{ height: "300px", marginTop:"10px", justifyItems:"center", alignContent:"center" }}>
            <h1>Đang xử lý đơn hàng...</h1>
            <p>Vui lòng chờ trong giây lát.</p>
        </div>
    );
};

export default Callback;
