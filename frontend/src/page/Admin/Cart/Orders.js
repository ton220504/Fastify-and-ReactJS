import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import "../../../assets/css/order.css";

const Order = () => {

    const [orders, setOrders] = useState([]);
    const [abate, setAbate] = useState([]);
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [abateprint, setAbatePrint] = useState([]);
    const [detailPrintModalShow, setDetailPrintModalShow] = useState(false);
    const [ setError] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    const labelRef = useRef();
    //xác nhận đơn hàng
    const handleConfirm = async (id) => {
        setLoadingId(id); // Bật trạng thái loading cho nút

        try {
            await putOrdersStatus(id, "PAID"); // Truyền trạng thái mới

            // Cập nhật trạng thái đơn hàng trong danh sách `orders`
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? { ...order, status: "PAID" } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        } finally {
            setLoadingId(null); // Tắt loading sau khi xong
        }
    };
    //xác nhận vận chuyển
    const handleDelivered = async (id) => {
        setLoadingId(id); // Bật trạng thái loading cho nút

        try {
            await putOrdersStatus(id, "DELIVERED"); // Truyền trạng thái mới

            // Cập nhật trạng thái đơn hàng trong danh sách `orders`
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? { ...order, status: "DELIVERED" } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        } finally {
            setLoadingId(null); // Tắt loading sau khi xong
        }
    };
    const getOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/orders`)
            const ords = response.data;
            setOrders(ords);
        } catch (error) {
            console.log("Lỗi khi gọi giỏ hàng", error)
        }
    }
    const putOrdersStatus = async (id, status) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/orders/${id}/status`,
                { status });

            console.log("Cập nhật trạng thái thành công:", response.data);

            if (response.status === 200) {
                return response.data;
            } else {
                console.error("Cập nhật thất bại, status code:", response.status);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error.response?.data || error.message);
        }
    };
    const deleteAbates = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn không thể khôi phục thao thác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng, xóa nó!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/orders/${id}`);
            Swal.fire({
                icon: "success",
                title: "Xóa thành công!",
            }).then(() => {
                getOrders();
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong!",
            });
        }
    }
    useEffect(() => {
        getOrders();
    }, [])
    //chi tiết
    const openDetailModal = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(id)
            if (!user) {
                setError("Không tìm thấy thông tin người dùng.");
                return;
            }

            const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setAbate(response.data);
            setDetailModalShow(true);
        } catch (error) {
            console.error("Lỗi khi gọi API đơn hàng:", error);
            setError("Không thể tải dữ liệu đơn hàng.");
        }
    };
    // const closeDetailModal = () => {
    //     setDetailModalShow(false);
    //     setAbate([]);
    // }
    const openModalWithOrder = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(id)
            if (!user) {
                setError("Không tìm thấy thông tin người dùng.");
                return;
            }
            const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setAbatePrint(response.data);
            setDetailPrintModalShow(true);
        } catch (error) {
            console.error("Lỗi khi gọi API đơn hàng:", error);
            setError("Không thể tải dữ liệu đơn hàng.");
        }
    };
    useEffect(() => {
        openDetailModal();
        openModalWithOrder();
    }, []);

    return (
        <div >
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Thanh toán</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>Tên người nhận</th>
                                        <th style={{ width: "120px" }}>Tổng tiền</th>
                                        <th>Tỉnh/Thành phố</th>
                                        <th>Huyện/Quận</th>
                                        <th>Xã/Phường</th>
                                        <th>Địa chỉ</th>
                                        <th style={{ width: "160px" }}>Chức năng</th>
                                        <th >Trạng thái đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {
                                        orders && orders.length > 0 ? (
                                            orders.map((aba) => (
                                                <tr key={aba.id} >
                                                    <td>{aba.id}</td>
                                                    <td>{aba.user.name}</td>
                                                    <td>{aba.total_price.toLocaleString()} Đ</td>
                                                    <td>{aba.address.province}</td>
                                                    <td>{aba.address.district}</td>
                                                    <td>{aba.address.ward}</td>
                                                    <td>{aba.address.street}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <Button variant=" me-2 btn btn-warning" onClick={() => openDetailModal(aba.id)} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                            </svg>
                                                        </Button>
                                                        <Button
                                                            variant=" me-2 btn btn-primary"
                                                            disabled={aba.status !== "PENDING"}
                                                            onClick={() => openModalWithOrder(aba.id)}
                                                            title={aba.status !== "PENDING" ? "Chỉ có thể in khi đơn đang chờ xác nhận" : ""}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                                                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                                                            </svg>
                                                        </Button>
                                                        <Button variant="danger">
                                                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteAbates(aba.id)} width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        {aba.status === "PENDING" ? (
                                                            <Button
                                                                onClick={() => handleConfirm(aba.id)}
                                                                variant="success"
                                                                disabled={loadingId === aba.id} // Vô hiệu hóa khi đang loading
                                                            >
                                                                {loadingId === aba.id ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        />{" "}
                                                                        Đang xác nhận...
                                                                    </>
                                                                ) : (
                                                                    "Xác nhận"
                                                                )}
                                                            </Button>
                                                        ) : aba.status === "CANCELED" ? (
                                                            <span style={{ color: "red", fontWeight: "bold" }}>Đã hủy</span>
                                                        ) : aba.status === "PAID" ? (
                                                            <Button
                                                                onClick={() => handleDelivered(aba.id)}
                                                                variant="primary"
                                                                disabled={loadingId === aba.id} // Vô hiệu hóa khi đang loading
                                                            >
                                                                {loadingId === aba.id ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        />{" "}
                                                                        Đang xác nhận...
                                                                    </>
                                                                ) : (
                                                                    "Giao hàng"
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <span style={{ color: "blue", fontWeight: "bold" }}>Đã hoàn thành</span>
                                                        )}
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">Loading...</td> {/* Hiển thị thông báo loading trong một dòng */}
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={detailModalShow} onHide={() => setDetailModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {abate ? (
                        <div>
                            {/* Thông tin khách hàng */}
                            <div><strong>Tên khách hàng:</strong> {abate.user?.name}</div>
                            <div><strong>Email:</strong> {abate.user?.email}</div>

                            {/* Thông tin đơn hàng */}
                            <div><strong>Phương thức thanh toán:</strong> {abate.payment_method}</div>
                            <div><strong>Trạng thái:</strong> {abate.status}</div>
                            <div><strong>Ngày đặt hàng:</strong> {new Date(abate.created_at).toLocaleString()}</div>

                            {/* Danh sách sản phẩm */}
                            <div><strong>Sản phẩm đã đặt:</strong></div>
                            {abate.items && abate.items.length > 0 ? (
                                <ul>
                                    {abate.items.map((item, index) => (
                                        <li key={item.id}>
                                            <div><strong>Tên sản phẩm:</strong> {item.product.name}</div>
                                            <div><strong>Số lượng:</strong> {item.quantity}</div>
                                            <div><strong>Giá:</strong> {item.product.price.toLocaleString()} VND</div>
                                            <div>
                                                <strong>Hình ảnh:</strong><br />
                                                <img
                                                    src={`http://localhost:3000/uploads/${item.image}`}
                                                    alt={item.product.name}
                                                    height="60"
                                                    width="60"
                                                    style={{ margin: '5px', borderRadius: '8px' }}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có sản phẩm nào được đặt.</p>
                            )}
                            {/* Tổng tiền */}
                            <div><strong>Tổng tiền:</strong> {abate.total_price ? abate.total_price.toLocaleString() : "Đang cập nhật"} VND</div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDetailModalShow(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={detailPrintModalShow} onHide={() => setDetailPrintModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title >Phiếu đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {abateprint ? (
                        <>
                            {/* Phần in phiếu */}
                            <div ref={labelRef} className="print-area" style={{ padding: 10, border: "1px solid #ccc", background: "#fff" }}>
                                <div style={{ padding: '20px' }}>
                                    <div ref={labelRef} style={{ width: '700px', border: '1px solid #000', padding: '16px', fontSize: '14px', fontFamily: 'Arial' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <img src="http://localhost:3000/uploads/logo.png" alt="bean_mobile" width="170" crossOrigin="anonymous" />
                                            <div>
                                                <div><strong>Mã vận đơn:</strong> SPEV{abateprint.id}</div>
                                                <div><strong>Mã đơn hàng:</strong> {abateprint.code || 'Z00' + abateprint.id}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: "10px" }}>
                                            <div style={{ width: "50%" }}>
                                                <strong>Từ:</strong><br />
                                                Bean Mobile<br />
                                                58/3 Tân Lập 1, phường Hiệp Phú, Tp.Thủ Đức, Tp.Hồ Chí Minh<br />
                                                0392083871
                                            </div>
                                            <div style={{ width: "50%" }}>
                                                <strong>Đến:</strong><br />
                                                <strong>{abateprint.user?.name}</strong><br />
                                                <strong>{abateprint.address?.street}, {abateprint.address?.ward}, {abateprint.address?.district}, {abateprint.address?.province}</strong><br />
                                                <strong>{abateprint.user?.phone}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div style={{ height: "200px" }}>
                                            <strong>Nội dung hàng (Tổng SL sản phẩm: {abateprint?.items?.length || 0}):</strong>
                                            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                                {abateprint?.items?.map((item, i) => (
                                                    <li key={i}>{i + 1} {item.product.name}, SL: {item.quantity}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <em>Một số sản phẩm có thể bị ẩn do danh sách quá dài.</em>
                                        </div>
                                        <hr />
                                        <div style={{ marginTop: '10px', display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ width: "220px" }}>
                                                <span>Tiền thu Người nhận:</span><br />
                                                <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}>
                                                    <strong style={{ fontSize: "20px" }}>
                                                        {abateprint.total_price?.toLocaleString()} VND
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>Chỉ dẫn giao hàng:</span><br />
                                                    - Không đồng kiểm<br />
                                                    - Giao hàng sau 3 lần phát<br />
                                                    - Chuyển hoàn tối đa 3 lần
                                                </div>
                                            </div>
                                            <div>
                                                <span>Khối lượng tịnh:</span> 300g
                                                <div style={{ border: "1px solid #ccc", padding: "8px", width: "300px", height: "150px", textAlign: "center" }}>
                                                    <strong>Chữ ký người nhận</strong><br />
                                                    <p style={{ fontSize: "13px" }}>Xác nhận hàng nguyên vẹn, không móp méo, bể/vỡ</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setDetailPrintModalShow(false)}>Đóng</Button>
                    <Button variant="success" onClick={() => window.print()}>🖨️ In phiếu</Button>
                    <Button
                        variant="info"
                        onClick={async () => {
                            if (!labelRef.current) return;
                            //const canvas = await html2canvas(labelRef.current);
                            const originalCanvas = await html2canvas(labelRef.current, {
                                useCORS: true,
                            });
                            const link = document.createElement("a");
                            link.download = `phieu-don-hang-${abateprint.id}.png`;
                            link.href = originalCanvas.toDataURL();
                            link.click();
                        }}
                    >
                        📥 Tải ảnh
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default Order;