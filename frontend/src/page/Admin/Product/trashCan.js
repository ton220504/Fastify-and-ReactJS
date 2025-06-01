import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";

const TrashCan = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [searchproducts, setS] = useState([]);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [RestoreProductId, setRestoreProductId] = useState(null);

    const [product, setProduct] = useState([]);
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    // 🟢 Hàm gọi API lấy sản phẩm theo trang, ưu tiên sản phẩm có releaseDate sớm nhất
    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:3000/api/productsIsDelete?page=${pageNumber}&limit=${perPage}`
            );

            const resData = response.data;

            if (resData) {
                const { data, meta } = resData;
                const { pagination } = meta;

                // Cập nhật state
                setProducts(data);
                setCurrentPage(pagination.page);
                setTotalPages(pagination.pageCount); // hoặc pagination.total nếu bạn muốn

                // Nếu cần xử lý ảnh
                fetchImagesAndUpdateProducts(data);
            }

        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);
    // 🟢 Gọi API khi component mount
    useEffect(() => {
        getProducts(1);
    }, [getProducts]);
    // 🟢 Điều hướng trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            getProducts(page);
        }
    };
    // Hàm fetch ảnh cho từng sản phẩm
    const fetchImagesAndUpdateProducts = async (data) => {
        if (!data || data.length === 0) return;
        const updatedProducts = data.map((product) => {
            const imageUrl = product.image
                ? `http://127.0.0.1:3000/uploads/${product.image}`
                : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có

            return { ...product, imageUrl };
        });

        setProducts(updatedProducts);
    };

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleDelete = (id) => {
        setDeletingProductId(id);

        Swal.fire({
            title: "Bạn có chắc không?",
            //text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                Axios.delete(`http://localhost:3000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((response) => {
                        Swal.fire({
                            icon: "Thành công",
                            title: "Xóa!",
                            text: "Xóa thành công!",
                        }).then(() => {
                            getProducts(currentPage); // Refresh the product list after deletion
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
                        setDeletingProductId(null); // Clear deleting state
                    });
            } else {
                setDeletingProductId(null); // If user cancels, clear deleting state
            }
        });
    };
    const handleRestore = (id) => {
        setRestoreProductId(id);

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
                    `http://localhost:3000/api/products/${id}/restore`,
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
                            text: "Khôi phục sản phẩm thành công!",
                        }).then(() => {
                            getProducts(currentPage); // Refresh the product list after deletion
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
                        setRestoreProductId(null); // Clear deleting state
                    });
            } else {
                setRestoreProductId(null); // If user cancels, clear deleting state
            }
        });
    };
    const closeProductDetailModal = () => {
        setDetailModalShow(false);
        setProduct([])
    }



    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Hình ảnh(đại diện)</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7">
                                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                                <Spinner animation="border" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td style={{ textAlign: "center" }}>
                                                <img
                                                    height="60px"
                                                    width="60px"
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                />
                                            </td>

                                            <td>{product.name}</td>


                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleRestore(product.id)}
                                                    disabled={RestoreProductId === product.id}
                                                    className="me-2"
                                                >
                                                    {RestoreProductId === product.id ? <Spinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                                    </svg>}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingProductId === product.id}
                                                >
                                                    {deletingProductId === product.id ? <Spinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                    </svg>}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* 🟢 Thanh phân trang */}
                    <div className="pageNumber">
                        <button
                            id="firstPage"
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <span id="page">Trang {currentPage} / {totalPages}</span>

                        <button
                            id="firstPage"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                                <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>



        </div>
    );
}

export default TrashCan