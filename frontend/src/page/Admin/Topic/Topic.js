import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Topic = () => {
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editTopicId, setEditTopicId] = useState(null);
    const [editTopicName, setEditTopicName] = useState("");
    const [editTopicSlug, setEditTopicSlug] = useState("");
    const [editTopicDescription, setEditTopicDescription] = useState("");

    const [success, setSuccess] = useState(false);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        if (name === "name") setName(value);
        if (name === "slug") setSlug(value);
        if (name === "description") setDescription(value);
    };

    const submitTopic = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
    
        // Nếu không có token thì cảnh báo
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Chưa đăng nhập!",
                text: "Vui lòng đăng nhập để thực hiện thao tác.",
            });
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:3000/api/topics`,
                {
                    name,
                    slug,
                    description,
                    sort_order: 0,
                    status: 1,
                    created_by: 1  // hoặc lấy từ user hiện tại nếu có
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Thêm thành công!',
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                fetchTopic();
                setName("");
                setSlug("");
                setDescription("");
            });
        } catch (error) {
            // Token hết hạn hoặc không hợp lệ
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi xác thực",
                    text: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
                });
            } else if (error.response?.status === 422) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                console.error("Lỗi khi tạo topic:", error);
            }
        }
    };
    
    const deleteTopic = async (id) => {
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
            await axios.delete(`http://localhost:3000/api/topics/${id}/soft-delete`, {
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
                fetchTopic();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/topics/${id}`);
            const to = response.data;
            setEditTopicId(to.id);
            setEditTopicName(to.name);
            setEditTopicDescription(to.description);
            setEditTopicSlug(to.slug);


            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching brand for edit", error);
            Swal.fire({
                text: "Failed to fetch brand for edit",
                icon: "error",
            });
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);
        setEditTopicId(null);
        setEditTopicName("");
        setEditTopicSlug("");
        setEditTopicDescription("");
    };

    const handleEditTopic = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:3000/api/topics/${editTopicId}`, // Sửa "topic" thành "topics" nếu đúng RESTful
                {
                    name: editTopicName,
                    slug: editTopicSlug,
                    description: editTopicDescription,
                    sort_order: 0, // bạn có thể dùng state nếu muốn cho người dùng chỉnh
                    status: 1      // 1 là đang hoạt động, 0 là ẩn – tuỳ theo hệ thống của bạn
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: "Sửa thành công!",
                timer: 2000,
                timerProgressBar: true
            });
    
            fetchTopic(); // reload lại danh sách
            closeEditModal(); // reset form
        } catch (error) {
            console.error("Failed to update topic", error);
            Swal.fire({
                text: "Lỗi khi cập nhật topic",
                icon: "error",
            });
        }
    };
    
    useEffect(() => {
        fetchTopic();
    }, []);

    const fetchTopic = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/topics`);
            const sortedCategories = (response.data || []).sort((a, b) => a.id - b.id);
            setTopics(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories", error);
            setTopics([]);
        }
    };


    return (
        <div className="row">
            <div className="col-4"  >
                <form onSubmit={submitTopic}>
                    <div className="container-fluid card shadow my-2 mx-2">
                    <h3 className="text-success text-center">Thêm Topic</h3>
                        <div className="mb-3 mt-3">
                            <label htmlFor="name" className="form-label">Topic</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Nhập tên Topic"
                                value={name}
                                onChange={changeHandler}
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
                            />
                        </div>
                        <div className="mb-3 ">
                            <textarea
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                placeholder="Nhập ghi chú"
                                value={description}
                                onChange={changeHandler}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mb-2">Lưu</button>
                    </div>
                </form>
            </div>
            <div className="col-8">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Tất cả Topic</h6>
                            <Link to={'/admin/topictrashcan'} className="btn btn-danger my-2 me-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>Thùng rác</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Tên</th>
                                            <th>Slug</th>
                                            <th>Ghi chú</th>
                                            <th style={{ width: "150px" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {topics.map((brand) => (
                                            <tr key={brand.id}>
                                                <td>{brand.id}</td>
                                                <td>{brand.name}</td>
                                                <td>{brand.slug}</td>
                                                <td>{brand.description}</td>
                                                <td>
                                                    <Button variant="success me-2" onClick={() => openEditModal(brand.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => deleteTopic(brand.id)}>
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
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Tên topic</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editName"
                            name="editName"
                            value={editTopicName}
                            onChange={(e) => setEditTopicName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Tên slug</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editSlug"
                            name="editSlug"
                            value={editTopicSlug}
                            onChange={(e) => setEditTopicSlug(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Ghi chú</label>
                        <textarea
                            type="text"
                            className="form-control"
                            id="editDescription"
                            name="editDescription"
                            value={editTopicDescription}
                            onChange={(e) => setEditTopicDescription(e.target.value)}
                        />
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditTopic}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Topic;
