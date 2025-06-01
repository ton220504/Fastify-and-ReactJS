import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const PostComment = () => {
    const { id } = useParams();
    const [postcomments, setPostcomment] = useState([]);
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
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/posts`);
                setPosts(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách bài viết:", err);
            }
        };

        fetchPosts();
    }, []);
    const filterByPost = () => {
        if (!selectedPostId) return;
        const filtered = postcomments.filter(comment => comment.post_id === parseInt(selectedPostId));
        if (filtered.length === 0) {
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                text: "Không timg thấy bình luận.",
                timer: 2000,
                timerProgressBar: true
            })
        }
        setFilteredReviews(filtered);
    };

    const deletePostComment = async (id) => {
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
            await axios.delete(`http://localhost:3000/api/postcomment/${id}`, {
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
                fetchPostComment();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };
    const fetchPostComment = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/postcomments`);
            const posts = (response.data || []);
            setPostcomment(posts);
        } catch (error) {
            console.error(error);
            setPostcomment([]);
        }
    };
    useEffect(() => {
        fetchPostComment();
    }, []);

    return (
        <div >
            <div >
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Tất cả Bình luận</h6>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <select
                                value={selectedPostId}
                                onChange={(e) => setSelectedPostId(e.target.value)}
                                className="border p-2 rounded"
                                style={{ width: "300px", marginLeft: "12px", marginTop: "10px" }}
                            >
                                <option value="">-- Chọn bài viết --</option>
                                {posts.map(post => (
                                    <option key={post.id} value={post.id}>{post.title}</option>
                                ))}
                            </select>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                style={{ marginLeft: "5px", backgroundColor: "green", border: "none" }}
                                onClick={filterByPost}
                                disabled={!selectedPostId}
                            >
                                Lọc
                            </button>
                            {filteredReviews.length > 0 && (
                                <button
                                    className="text-white px-4 py-2 rounded"
                                    style={{ marginLeft: "5px", backgroundColor: "gray", border: "none" }}
                                    onClick={() => {
                                        setFilteredReviews([]);
                                        setSelectedPostId("");
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
                                            <th>Tên bài viết</th>
                                            <th>Nội dung</th>
                                            <th>Thời gian</th>
                                            <th style={{ width: "150px" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {(filteredReviews.length > 0 ? filteredReviews : postcomments).map((pot) => (
                                            <tr key={pot.id}>
                                                <td>{pot.id}</td>
                                                <td>{pot.user?.username}</td>
                                                <td>{pot.post?.title}</td>
                                                <td>{pot.content}</td>
                                                <td>{new Date(pot.created_at).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}</td>
                                                <td>

                                                    <Button variant="danger" onClick={() => deletePostComment(pot.id)}>
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

export default PostComment;
