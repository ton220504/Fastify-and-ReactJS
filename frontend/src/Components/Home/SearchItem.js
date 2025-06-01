
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import numeral from "numeral";
import { Card } from "react-bootstrap";
import "../../assets/css/header.css";
import ComeBack from "../ComeBack";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query"); // Lấy từ khóa từ URL
    const [results, setResults] = useState([]);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10; // Số sản phẩm mỗi trang
    const [currentPage, setCurrentPage] = useState(1);

    const fetchResults = async (pageNumber = 1) => {
        if (!query) return;

        try {
            const response = await axios.get(
                `http://127.0.0.1:3000/api/products/search`,
                {
                    params: {
                        searchTerm: query,
                        page: `${pageNumber}`,
                        limit: 10
                    }
                }
            );

            const products = response.data?.data || [];
            const pagination = response.data?.meta?.pagination;

            if (pagination) {
                setCurrentPage(pagination.page);
                setTotalPages(pagination.pageCount); // hoặc pagination.total nếu bạn muốn tổng item
            }

            // Gắn link ảnh
            const updatedResults = products.map((product) => ({
                ...product,
                imageUrl: product.image
                    ? `http://127.0.0.1:3000/uploads/${product.image}`
                    : "/images/default-placeholder.jpg"
            }));

            setResults(updatedResults);
        } catch (error) {
            console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
            setResults([]);
        }
    };


    useEffect(() => {

        fetchResults();
    }, [query]);
    // 🟢 Điều hướng trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchResults(page);
        }
    };
    return (
        <>
            <ComeBack/>
            <div className="container mt-4">
                <h2 style={{ fontStyle: "oblique" }}>Kết quả tìm kiếm cho: "{query}"</h2>
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                        <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {results.length > 0 ? (
                                results.map((item) => (
                                    <Card className="box col-2 m-2 item-cart" key={item.id}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}

                                        <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                            <Card.Img
                                                className="product-image"
                                                src={item.imageUrl}
                                                alt={item.name}
                                            />
                                        </Link>
                                        <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                        <div>
                                            <p className="text_name">{item.name}</p>
                                        </div>
                                        <div className="list-group-flush">
                                            <hr />
                                            <p className="text_price">Giá: {formatCurrency(item.price)}</p>
                                            <hr />
                                            <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="NoProductSearch">Không có sản phẩm nào để hiển thị</div>
                            )}
                        </div>
                    </section>


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
                            <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                        </svg>
                    </button>

                    <button
                        id="first"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "disabled-button" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
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
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </button>

                    <button
                        id="first"
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "disabled-button" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                            <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchResults;
