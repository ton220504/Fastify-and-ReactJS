import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../scss/Pay.scss"
import { SiCashapp } from "react-icons/si";
import { Button, Table, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import confetti from 'canvas-confetti';
import { Spinner } from 'react-bootstrap';


const Pay = () => {


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const [editModalShow, setEditModalShow] = useState(false);
    const [isLocationSelected, setIsLocationSelected] = useState(false); // Trạng thái chọn địa phương
    const location = useLocation();
    const { selectedItems, totalAmount, userItems } = location.state || { selectedItems: [], totalAmount: 0, userItems: [] };
    const [totalMoney, setTotalMoney] = useState(totalAmount);
    const [selectedPay, setSelectedPay] = useState(""); //xử lý chọn phương thức thanh toán.

    const [email, setEmail] = useState(userItems.email || "");
    const [name, setName] = useState(userItems.username || "");
    const [phone, setPhone] = useState(userItems.phone || "");
    const [products, setProducts] = useState([]);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [address, setAddress] = useState("");
    const fee = 40000; // Đặt phí cố định
    const [selectedItemsChecked, setSelectedItemsChecked] = useState(
        selectedItems.map(() => true) // tất cả mặc định được chọn
    );


    const paymentMethods = [
        { label: "Thanh toán khi nhận hàng", value: "COD", img: "https://cdn-icons-png.flaticon.com/512/10694/10694769.png" },
        { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER", img: "https://www.pngitem.com/pimgs/m/13-130625_credit-card-rewards-star-ratings-payment-icon-credit.png" },
        { label: "Thẻ tín dụng", value: "CREDIT_CARD", img: "https://ueeshop.ly200-cdn.com/u_file/UPAF/UPAF092/2109/photo/015bb9c5e6.png" },
        { label: "Thanh toán qua PayPal", value: "PAYPAL", img: "https://th.bing.com/th/id/R.4c1bc940cd1839147238063a47001093?rik=HVt74ZEYD0%2fiwQ&pid=ImgRaw&r=0" },
        { label: "Thanh toán qua MoMo", value: "MOMO", img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" },
    ];
    const handleSelect = (value) => {
        setSelectedPay(value); // Cập nhật state với phương thức thanh toán
    };

    // Style cho overlay
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền mờ
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // Đảm bảo nó nằm trên cùng
    };

    function handleChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case "name":
                setName(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "totalMoney":
                setTotalMoney(value);
                break;
            case "provinces":
                setProvince(value);
                break;
            case "district":
                setDistrict(value);
                break;
            case "wards":
                setWard(value);
                break;
            case "address":
                setAddress(value);
                break;
            default:
                break;
        }
    }

    async function handleSubmit(e) {
        //e.preventDefault();
        if (!email || !name || !phone || !selectedProvince || !selectedDistrict || !selectedWard || !address) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem("user"));
        // Tạo danh sách items theo định dạng mới
        const items = selectedItems
            .filter((item, index) => selectedItemsChecked[index])
            .map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                image: item.imageUrl
            }));
        const orderData = {
            user_id: user.id,
            total_price: totalMoney,
            status: "pending",
            payment_method: selectedPay.toLowerCase(), // ví dụ: "cod"
            address: {
                province: province,
                district: district,
                ward: ward,
                street: address
            },
            items: items
        };
        try {
            // 1. Gửi đơn hàng
            const res = await axios.post(`http://127.0.0.1:3000/api/orders`, orderData);
            // 🔥 Trừ tồn kho sau khi tạo đơn hàng thành công
            await Promise.all(items.map(item =>
                axios.put(`http://localhost:3000/api/products/${item.product_id}/stock`, {
                    stock_quantity: item.quantity // Đảm bảo `stock_quantity` là số lượng bạn muốn trừ
                })
                    .catch(err => {
                        console.error(`Lỗi khi cập nhật tồn kho cho sản phẩm ID: ${item.productId}`, err);
                    })
            ));
            // 2. Xóa cart items (nếu có chọn từ giỏ hàng)
            const cartItemIds = selectedItems.reduce((acc, item, index) => {
                if (item.fromCart && selectedItemsChecked[index]) {
                    if (item.cartItemId) acc.push(item.cartItemId);
                    else console.warn('⚠️ Thiếu cartItemId ở item:', item);
                }
                return acc;
            }, []);
            if (cartItemIds.length > 0) {
                await Promise.all(
                    cartItemIds.map(id =>
                        axios.delete(`http://127.0.0.1:3000/api/cartsItem/${id}`)
                    )
                );
                console.log('Đã xóa sản phẩm khỏi giỏ hàng.');
            }
            // 3. Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công',
                text: 'Bạn muốn làm gì tiếp theo?',
                showCancelButton: true,
                confirmButtonText: 'Tiếp tục mua hàng',
                cancelButtonText: 'Về trang chủ',
                backdrop: 'rgba(0, 0, 0, 0.5)'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/tat-ca-san-pham");
                } else {
                    navigate("/");
                }
            });
        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setErrorMessage("Lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    }
    const handleCheckboxChange = (index) => {
        const updatedChecked = [...selectedItemsChecked];
        updatedChecked[index] = !updatedChecked[index];
        setSelectedItemsChecked(updatedChecked);
    };

    // 🟢 Hàm tính tổng tiền của từng sản phẩm
    const calculateItemTotal = (item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        const quantity = item.quantity ? parseInt(item.quantity) : 0;
        return price * quantity;
    };
    // 🟢 Hàm tính tổng tiền toàn bộ đơn hàng
    const calculateTotalAmount = () => {
        return selectedItems.reduce((acc, item, index) => {
            if (selectedItemsChecked[index]) {
                return acc + calculateItemTotal(item);
            }
            return acc;
        }, 0);
    };

    // 🟢 useEffect để cập nhật tổng tiền khi selectedItems thay đổi
    useEffect(() => {
        const newTotal = calculateTotalAmount();
        setTotalMoney(newTotal + fee); // fee là phí vận chuyển (nếu có)
    }, [selectedItems, selectedItemsChecked, fee]);

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return "0 VND"; // Nếu không có giá trị hợp lệ, trả về "0 VND"

        return parseFloat(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };
    useEffect(() => {
        // Lấy danh sách tỉnh thành
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);
    useEffect(() => {
        // Lấy danh sách quận huyện khi tỉnh thành được chọn
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(response.data.data);

                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };

            fetchDistricts();
        }
    }, [selectedProvince]);
    useEffect(() => {
        // Lấy danh sách phường xã khi quận huyện được chọn
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(response.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };

            fetchWards();
        }
    }, [selectedDistrict]);
    const handleSubmitMomo = async () => {
        try {
            if (!email || !name || !phone || !selectedProvince || !selectedDistrict || !selectedWard || !address) {
                setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
                return;
            }
            const user = JSON.parse(localStorage.getItem("user"));
            if (totalAmount > 50000000) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    position: "top-end",
                    title: 'Thanh toán MoMo chỉ thanh toán hóa đơn nhỏ hơn 50.000.00đ !',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
                });
                return;
            }
            const items = selectedItems
                .filter((item, index) => selectedItemsChecked[index])
                .map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.imageUrl,
                    fromCart: item.fromCart,
                    cartItemId: item.cartItemId
                }));

            const orderInfo = {
                user_id: user.id,
                total_price: totalMoney,
                status: "pending",
                payment_method: "momo",
                address: {
                    province,
                    district,
                    ward,
                    street: address
                },
                items,
            };

            // ✅ Không tạo đơn tại đây — chỉ lưu
            localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

            const response = await axios.post('http://127.0.0.1:3000/payment', {
                total: totalMoney
            });

            if (response.data.payUrl) {
                window.location.href = response.data.payUrl;
            } else {
                alert("Có lỗi xảy ra khi tạo thanh toán.");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi mạng hoặc máy chủ.");
        }
    };
    return (
        <>
            <Form className="abate" >
                <div className="Pay container">
                    {isLoading && (
                        <div style={overlayStyle}>
                            <Spinner animation="border" variant="light" /> {/* Loading spinner */}
                        </div>
                    )}
                    <div className=" row">
                        <div className="col-8">
                            <div className="main-header">
                                <img className="logo" style={{ width: "300px", paddingTop: "10px", display: "block", margin: "0 auto" }} src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/checkout_logo.png?1726452627090" />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger text-center">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="row">
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Thông tin người nhận</b>
                                    </div>
                                    <div className="mb-3">
                                        <input style={{ fontWeight: "bold" }} type="email" name="email" className="form-control" onChange={handleChange}
                                            value={email}
                                            placeholder="Nhập email" />
                                    </div>
                                    <div className="mb-3">
                                        <input style={{ fontWeight: "bold" }} type="name" name="name" className="form-control" onChange={handleChange}
                                            value={name}
                                            placeholder="Nhập Họ Tên" />
                                    </div>
                                    <div className="mb-3">
                                        <input style={{ fontWeight: "bold" }} type="phone" name="phone" className="form-control" onChange={handleChange}
                                            value={phone}
                                            placeholder="Số điện thoại" />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedProvince(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedProvinceObj = provinces.find(prov => prov.id === selectedId);
                                                if (selectedProvinceObj) {
                                                    setProvince(selectedProvinceObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setProvince(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}

                                        >
                                            <option value="">Chọn Tỉnh, Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>{province.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedDistrict}
                                            //onChange={(e) => setSelectedDistrict(e.target.value)}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedDistrict(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedDistrictObj = districts.find(prov => prov.id === selectedId);
                                                if (selectedDistrictObj) {
                                                    setDistrict(selectedDistrictObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setDistrict(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Quận, Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedWard}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedWard(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên phường xã tương ứng với ID đã chọn
                                                const selectedWardObj = wards.find(ward => ward.id === selectedId);
                                                if (selectedWardObj) {
                                                    setWard(selectedWardObj.name); // Lưu tên phường/xã
                                                } else {
                                                    setWard(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Phường, Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>{ward.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <textarea rows="4" name="address" onChange={handleChange} className="form-control" placeholder="Nhập địa chỉ cần giao..." />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Vận chuyển</b>
                                    </div>
                                    <div className="ship-cod form-control">
                                        <div className="ship">
                                            <input type="radio" checked readOnly />
                                            <span style={{ marginLeft: '8px' }}>Giao hàng tận nơi</span>
                                        </div>
                                        <span className="cod" style={{ fontWeight: "bold", marginLeft: "8px" }}>{formatCurrency(fee)}</span>
                                    </div>
                                    <div className="my-3">
                                        <b>Phương thức thanh toán</b>
                                    </div>
                                    <div className="method form-control">
                                        {paymentMethods.map((method) => (
                                            <div key={method.value}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    checked={selectedPay === method.value}
                                                    onChange={() => handleSelect(method.value)}
                                                />
                                                <span style={{ marginLeft: '8px' }}>{method.label}</span>
                                                <img style={{ width: "30px", height: "25px", marginLeft: "10px" }} src={method.img} />
                                            </div>
                                        ))}
                                    </div>
                                    <p onClick={() => navigate(-1)} className="form-control" style={{ color: "#503eb6", fontWeight: "bold", marginTop: "10px", width: "74px", backgroundColor: "#c9bef4", cursor: "pointer" }}>Trở về</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4  " style={{ height: "730px", width: "400px", borderLeft: "3px solid lightgray" }} >
                            <div className="order container">
                                <div className="container">
                                    <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>Thông tin thanh toán</p>
                                    <div className="order-summary">
                                        <p>Sản phẩm đã chọn:</p>
                                        <hr />
                                        {selectedItems.length === 0 ? (
                                            <p>Không có sản phẩm nào được chọn.</p>
                                        ) : (
                                            <ul>
                                                {selectedItems.map((item, index) => (
                                                    <React.Fragment key={`${item.id}-${index}`}>
                                                        <li className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.name}
                                                                    style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                                />
                                                                <div>
                                                                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>{item.name}</span><br />
                                                                    <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                        Số lượng: {item.quantity}
                                                                    </span><br />
                                                                    <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                        {formatCurrency(item.price)}
                                                                    </span>
                                                                </div>
                                                                <input checked={selectedItemsChecked[index]}
                                                                    onChange={() => handleCheckboxChange(index)}
                                                                    style={{ marginLeft: "12px" }} type="checkbox"
                                                                />
                                                            </div>
                                                        </li>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <p>Tạm tính:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {formatCurrency(
                                                    selectedItems.reduce((acc, item, index) => {
                                                        return selectedItemsChecked[index] ? acc + calculateItemTotal(item) : acc;
                                                    }, 0)
                                                )}
                                            </strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Phí vận chuyển: </p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(fee)}</strong>
                                            </strong>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <p>Tổng tiền:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px", color: "red" }}>
                                                {formatCurrency(totalMoney)} {/* Hiển thị tổng tiền */}
                                            </strong>
                                        </div>
                                        <button
                                            onClick={(event) => {
                                                event.preventDefault(); // ✅ Sửa lỗi ở đây

                                                if (selectedPay === "COD") {
                                                    handleSubmit(); // Xử lý thanh toán khi nhận hàng
                                                } else if (selectedPay === "PAYPAL") {
                                                    Swal.fire({
                                                        toast: true,
                                                        icon: 'warning',
                                                        position: "top-end",
                                                        title: 'Phương thức chưa khả dụng, vui lòng chọn phương thức khác!',
                                                        confirmButtonText: 'OK',
                                                        timer: 2000,
                                                        timerProgressBar: true
                                                    });
                                                } else if (selectedPay === "CREDIT_CARD") {
                                                    Swal.fire({
                                                        toast: true,
                                                        icon: 'warning',
                                                        position: "top-end",
                                                        title: 'Phương thức chưa khả dụng, vui lòng chọn phương thức khác!',
                                                        confirmButtonText: 'OK',
                                                        timer: 2000,
                                                        timerProgressBar: true
                                                    });
                                                } else if (selectedPay === "BANK_TRANSFER") {
                                                    Swal.fire({
                                                        toast: true,
                                                        icon: 'warning',
                                                        position: "top-end",
                                                        title: 'Phương thức chưa khả dụng, vui lòng chọn phương thức khác!',
                                                        confirmButtonText: 'OK',
                                                        timer: 2000,
                                                        timerProgressBar: true
                                                    });
                                                } else if (selectedPay === "MOMO") {
                                                    handleSubmitMomo(); // Xử lý thanh toán MoMo
                                                } else {
                                                    Swal.fire({
                                                        toast: true,
                                                        icon: 'warning',
                                                        position: "top-end",
                                                        title: 'Vui lòng chọn phương thức thanh toán!',
                                                        confirmButtonText: 'OK',
                                                        timer: 2000,
                                                        timerProgressBar: true
                                                    });
                                                }
                                            }}
                                            className="form-control"
                                            style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }}
                                        >
                                            Thanh toán
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
}
export default Pay;