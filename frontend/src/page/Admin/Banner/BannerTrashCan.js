import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Axios from "axios";
import Swal from "sweetalert2";
const BannerTrashCan = () => {
    const [banner, setBanner] = useState([]);
    const [deletingBannersId, setDeletingBannersId] = useState(null);
    const [RestoreBannersId, setRestoreBannersId] = useState(null);
    const fetchBanner = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/bannersIsDelete`);
            const sortedBrand = (response.data || []).sort((a, b) => a.id - b.id);
            setBanner(sortedBrand);
        } catch (error) {
            console.error("Error fetching categories", error);
            setBanner([]);
        }
    };
    useEffect(() => {
        fetchBanner();
    }, []);
    const deleteBrand = async (id) => {
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
            await axios.delete(`http://localhost:3000/api/banners/${id}`, {
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
                fetchBanner();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };
    const handleRestore = (id) => {
        setRestoreBannersId(id);

        Swal.fire({
            title: "Bạn có chắc không?",
            //text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, khôi phục!",
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                Axios.put(
                    `http://localhost:3000/api/banners/${id}/restore`,
                    {}, // <- body trống vì không gửi gì
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                    .then((response) => {
                        Swal.fire({
                            icon: "Thành công",
                            title: "Khôi phục!",
                            text: "Khôi phục thành công!",
                        }).then(() => {
                            fetchBanner();
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error.response?.data?.message || "Something went wrong!",
                        });
                    })
                    .finally(() => {
                        setRestoreBannersId(null); // Clear deleting state
                    });
            } else {
                setRestoreBannersId(null); // If user cancels, clear deleting state
            }
        });
    };
    return (
        <div >
            <div className="container-fluid">
                <div className="card shadow mb-4">

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên</th>
                                        <th>Hình ảnh</th>
                                        <th style={{ width: "150px" }}>Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {banner.map((brand) => (
                                        <tr key={brand.id}>
                                            <td>{brand.id}</td>
                                            <td>{brand.name}</td>
                                            <td><img
                                                height="60px"
                                                width="100px"
                                                src={`http://127.0.0.1:3000/uploads/${brand.image}`}
                                                alt={brand.name}
                                            /></td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleRestore(brand.id)}
                                                    disabled={RestoreBannersId === brand.id}
                                                    className="me-2"
                                                >
                                                    {<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                                    </svg>}
                                                </Button>
                                                <Button variant="danger" onClick={() => deleteBrand(brand.id)}>
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
    )
}

export default BannerTrashCan