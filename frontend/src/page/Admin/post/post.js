import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Post = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [detail, setDetail] = useState("");
    const [topic, setTopic] = useState([]);
    const [topicId, setTopicId] = useState(""); // Topic được chọn



    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [editPostTitle, setEditPostTitle] = useState("");
    const [editPostSlug, setEditPostSlug] = useState("");
    const [editPostDescription, setEditPostDescription] = useState("");
    const [editPostDetail, setEditPostDetail] = useState("");
    const [editPostTopicId, setEditPostTopicId] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };
    const [editPostImage, setEditPostImage] = useState(null); // File ảnh mới
    const [editImagePreview, setEditImagePreview] = useState(""); // URL ảnh để preview
    const [editImageFilename, setEditImageFilename] = useState(""); // Tên file gốc của ảnh cũ



    const [success, setSuccess] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "title":
                setTitle(value);
                break;
            case "slug":
                setSlug(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "detail":
                setDetail(value);
                break;
            default:
                break;
        }
    };
    const submitPost = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Chưa đăng nhập!",
                text: "Vui lòng đăng nhập để thực hiện thao tác.",
            });
            return;
        }

        try {
            let imageName = "";

            // 1. Nếu có chọn ảnh, upload trước
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile); // key: "file" theo backend

                const uploadRes = await axios.post("http://localhost:3000/api/upload", formData);
                imageName = uploadRes.data.filename;
            }

            // 2. Tạo object đúng theo Swagger
            const postData = {
                title,
                slug,
                description,
                detail,
                image: imageName,
                topic_id: Number(topicId),   // Có thể ép kiểu nếu cần
                status: 1,
                created_by: 1                // Hoặc decode từ token nếu cần bảo mật
            };

            // 3. Gửi POST request
            const response = await axios.post("http://localhost:3000/api/posts", postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // 4. Thành công
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Thêm bài viết thành công!',
                timer: 2000,
                timerProgressBar: true
            });

            // 5. Reset form
            setTitle("");
            setSlug("");
            setDescription("");
            setDetail("");
            setTopicId("");
            setImageFile(null);
            fetchPost();

        } catch (error) {
            console.error("Lỗi khi tạo bài viết:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: error.response?.data?.message || "Có lỗi xảy ra khi tạo bài viết.",
                timer: 2000,
                timerProgressBar: true
            });
        }
    };


    const deletePost = async (id) => {
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
            await axios.delete(`http://localhost:3000/api/posts/${id}/soft-delete`, {
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
                fetchPost();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
                timer: 2000,
                timerProgressBar: true
            });
        }
    };
    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts/${id}`);
            const to = response.data;

            setEditPostId(to.id);
            setEditPostTitle(to.title);
            setEditPostDetail(to.detail);
            setEditPostDescription(to.description);
            setEditPostSlug(to.slug);
            setEditPostTopicId(to.topic_id); // từ API trả về

            const imageUrl = to.image ? `http://localhost:3000/uploads/${to.image}` : "/images/default-placeholder.jpg";
            setEditImagePreview(imageUrl);
            setEditImageFilename(to.image || ""); // <-- Lưu lại tên ảnh gốc
            setEditPostImage(null); // Clear file input


            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching brand for edit", error);
            Swal.fire({
                text: "Failed to fetch brand for edit",
                icon: "error",
            });
        }
    };
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditPostImage(file);
            setEditImagePreview(URL.createObjectURL(file)); // Hiển thị preview tạm thời
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);
        setEditPostId(null);
        setEditPostTitle("");
        setEditPostDetail("");
        setEditPostDescription("");
        setEditPostSlug("");
    };


    const handleEditpost = async () => {
        try {
            const token = localStorage.getItem("token");
            let imageFilename = editImageFilename; // <-- đây là tên file gốc

            // Nếu có ảnh mới → upload ảnh
            if (editPostImage instanceof File) {
                const formData = new FormData();
                formData.append("imageFile", editPostImage);

                const uploadRes = await axios.post("http://localhost:3000/api/upload", formData);
                imageFilename = uploadRes.data.filename; // <-- cập nhật với tên file mới
            }

            const updatedPost = {
                title: editPostTitle,
                slug: editPostSlug,
                description: editPostDescription,
                detail: editPostDetail,
                image: imageFilename, // <-- gửi tên file, không phải URL
                topic_id: 1,
                created_by: 1,
                status: 1
            };

            await axios.put(`http://localhost:3000/api/posts/${editPostId}`, updatedPost, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: "Sửa bài viết thành công!",
                timer: 2000,
                timerProgressBar: true
            });

            fetchPost();
            closeEditModal();
        } catch (error) {
            console.error("Failed to update post", error);
            Swal.fire({
                text: error.response?.data?.message || "Lỗi khi cập nhật bài viết!",
                icon: "error",
                timer: 2000,
                timerProgressBar: true
            });
        }
    };

    const fetchTopic = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:3000/api/topics")
            const top = response.data;
            setTopic(top);
        } catch (error) {
            console.log("Lỗi call Topic: ", error);
        }
    }


    useEffect(() => {
        fetchPost();
        fetchTopic();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts`);
            const post = (response.data || []).sort((a, b) => a.id - b.id);
            setPosts(post);
        } catch (error) {
            console.error("Error fetching categories", error);
            setPosts([]);
        }
    };


    return (
        <div className="row">
            <div className="col-6"  >
                <form onSubmit={submitPost}>
                    <div className="container-fluid card shadow my-2 mx-2">
                        <div>
                            <h3 className="text-success text-center">Thêm bài viết</h3>
                        </div>
                        <div className="mb-3 mt-3">
                            <label htmlFor="title" className="form-label">Bài viết</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                placeholder="Nhập title"
                                value={title}
                                onChange={changeHandler}
                                required
                            />
                        </div>
                        <div className="mb-3 ">
                            <input
                                type="text"
                                className="form-control"
                                id="slug"
                                name="slug"
                                placeholder="Nhập slug"
                                value={slug}
                                onChange={changeHandler}
                                required
                            />
                        </div>
                        <select
                            className='form-control mb-3'
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            required
                        >
                            <option value="">Chọn Topic</option>
                            {topic.map((to, index) => (
                                <option key={index} value={to.id}>{to.name}</option>
                            ))}
                        </select>

                        <div className="mb-3 ">
                            <textarea
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                placeholder="Nhập ghi chú"
                                value={description}
                                onChange={changeHandler}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-3 ">
                            <textarea
                                type="text"
                                className="form-control"
                                id="detail"
                                name="detail"
                                placeholder="Nhập detail"
                                value={detail}
                                onChange={changeHandler}
                                rows="7"
                                required
                            />
                        </div>
                        <input
                            className="form-control mb-3"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            required
                        />
                        <button type="submit" className="btn btn-primary mb-2">Lưu</button>
                    </div>
                </form>
            </div>
            <div className="col-6">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Tất cả bài viết</h6>
                            <Link to={'/admin/posttrashcan'} className="btn btn-danger my-2 me-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>Thùng rác</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Title</th>
                                            <th>Ảnh</th>
                                            <th style={{ width: "160px" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {posts.map((brand) => (
                                            <tr key={brand.id}>
                                                <td>{brand.id}</td>
                                                <td>{brand.title}</td>
                                                <td><img
                                                    height="60px"
                                                    width="100px"
                                                    src={`http://127.0.0.1:3000/uploads/${brand.image}`}
                                                    alt={brand.title}
                                                /></td>
                                                <td>

                                                    <Button variant="success me-2" onClick={() => openEditModal(brand.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => deletePost(brand.id)}>
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
            {/* Sửa post */}
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa Bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="editTitle" className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editTitle"
                            name="editTitle"
                            value={editPostTitle}
                            onChange={(e) => setEditPostTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="editSlug" className="form-label">Tên slug</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editSlug"
                            name="editSlug"
                            value={editPostSlug}
                            onChange={(e) => setEditPostSlug(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="editTopic" className="form-label">Chủ đề</label>
                        <select
                            id="editTopic"
                            className="form-control"
                            value={editPostTopicId}
                            onChange={(e) => setEditPostTopicId(e.target.value)}
                        >
                            <option value="">-- Chọn Topic --</option>
                            {topic.map((to) => (
                                <option key={to.id} value={to.id}>{to.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="editDescription" className="form-label">Ghi chú</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editDescription"
                            name="editDescription"
                            value={editPostDescription}
                            onChange={(e) => setEditPostDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="editDetail" className="form-label">Detail</label>
                        <textarea
                            type="text"
                            className="form-control"
                            id="editDetail"
                            name="editDetail"
                            value={editPostDetail}
                            onChange={(e) => setEditPostDetail(e.target.value)}
                            rows="6"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><strong>Hình ảnh</strong></label>
                        <div className="image-preview mb-2">
                            {editImagePreview && (
                                <img
                                    src={editImagePreview}
                                    alt="preview"
                                    style={{
                                        width: "350px",
                                        height: "150px",
                                        objectFit: "cover",
                                        
                                    }}
                                />
                            )}
                        </div>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleEditImageChange}
                            name="image"
                        />
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditpost}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Post;
