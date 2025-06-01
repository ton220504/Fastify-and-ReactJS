import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Review = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [productName, setProductName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editreviewId, setEditReviewId] = useState(null);
    const [editreviewContent, setEditReviewContent] = useState("");
    const [editreviewUser, setEditReviewUser] = useState("");
    const [editreviewProduct, setEditReviewProduct] = useState("");
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [products, setProduct] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const searchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/reviews/search?name=${productName}`);
            setFilteredReviews(response.data);
            setProductName("");
        } catch (error) {
            console.error("Lỗi khi tìm đánh giá:", error);
            alert("Đã xảy ra lỗi khi tìm đánh giá.");
        } finally {
            setLoading(false);
        }
    };
    const deletereview = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: "Cảnh báo",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/reviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                text: "Xóa thành công.",
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                fetchReview();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };
    const fetchReview = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reviews`);
            const sortedCategories = (response.data || []);
            setReviews(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories", error);
            setReviews([]);
        }
    };
    useEffect(() => {
        fetchReview();
    }, []);
    useEffect(() => {
        const fetchProductName = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/productsname")
                setProduct(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchProductName();
    }, [])
    const filterName = () => {
        if (!selectedProductId) return;

        const filtered = reviews.filter(
            (review) => review.product?.id === parseInt(selectedProductId)
        );

        if (filtered.length === 0) {
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                text: "Không tìm thấy đánh giá.",
                timer: 2000,
                timerProgressBar: true
            });
        }

        setFilteredReviews(filtered);
    };



    return (
        <div >
            <div >
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Tất cả Đánh giá</h6>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {/* <input
                                type="text"
                                style={{ width: "300px", marginLeft: "12px", marginTop: "10px" }}
                                className="border p-2 flex-grow rounded "
                                placeholder="Nhập tên sản phẩm (VD: iPhone 16)"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded "
                                style={{ marginLeft: "5px", backgroundColor: "green", border: "none" }}
                                onClick={searchReviews}
                            >
                                {loading ? "Đang tìm..." : "Tìm kiếm"}
                            </button>
                            {filteredReviews.length > 0 && (

                                <button
                                    className=" text-white px-4 py-2 rounded "
                                    style={{ marginLeft: "5px", backgroundColor: "gray", border: "none" }}
                                    onClick={() => setFilteredReviews([])}
                                >
                                    Quay lại
                                </button>
                            )} */}
                            <select
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                className="border p-2 rounded"
                                style={{ width: "300px", marginLeft: "12px", marginTop: "10px" }}
                            >
                                <option  value="">-- Chọn sản phẩm --</option>
                                {products.map(pro => (
                                    <option  key={pro.id} value={pro.id}>{pro.name}</option>
                                ))}
                            </select>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                style={{ marginLeft: "5px", backgroundColor: "green", border: "none" }}
                                onClick={filterName}
                                disabled={!selectedProductId}
                            >
                                Lọc
                            </button>
                            {filteredReviews.length > 0 && (
                                <button
                                    className="text-white px-4 py-2 rounded"
                                    style={{ marginLeft: "5px", backgroundColor: "gray", border: "none" }}
                                    onClick={() => {
                                        setFilteredReviews([]);
                                        setSelectedProductId("");
                                    }}
                                >
                                    Quay lại
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Người dùng</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Nội dung</th>
                                            <th>Thời gian</th>
                                            <th style={{ width: "150px" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {(filteredReviews.length > 0 ? filteredReviews : reviews).map((review) => (
                                            <tr key={review.id}>
                                                <td>{review.id}</td>
                                                <td>{review.user?.username}</td>
                                                <td>{review.product?.name}</td>
                                                <td>{review.content}</td>
                                                <td>{new Date(review.created_at).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deletereview(review.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;
