import React, { useEffect, useState } from "react";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import ContentHeader from "./ContentHeader";

import { Link } from "react-router-dom";
import "../../../assets/css/header.css";
import axios from "axios";
import numeral from "numeral";

//Lấy dữ liệu từ database


const Header = () => {
    const [products, setProducts] = useState([]);

    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme : "light-theme";
    };
    const [selectedCategory, setSelectedCategory] = useState("");
    const [theme, setTheme] = useState(getInitialTheme());
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    
    // Danh sách sản phẩm ví dụ
    const product = [
        "Laptop Dell",
        "Laptop HP",
        "iPhone 13",
        "Samsung Galaxy S21",
        "Sony Headphones",
        "MacBook Air",
        "Apple Watch",
    ];

    const handleChange = async (value) => {
        setInput(value);
        const searchKeyword = value.trim().toLowerCase();
    
        if (searchKeyword.length >= 1) {
            setShowSearchResults(true);
    
            try {
                const response = await axios.get(
                    `http://127.0.0.1:3000/api/products/search`,
                    {
                        params: {
                            searchTerm: searchKeyword,
                            page: 1,
                            limit: 10
                        }
                    }
                );
    
                let searchData = response.data?.data || [];
    
                // Gắn URL ảnh trực tiếp từ tên file
                const updatedData = searchData.map((product) => ({
                    ...product,
                    imageUrl: product.image
                        ? `http://127.0.0.1:3000/uploads/${product.image}`
                        : "/images/default-placeholder.jpg"
                }));
    
                setSearchResults(updatedData);
                setNoResults(updatedData.length === 0);
            } catch (error) {
                console.error("Lỗi tìm kiếm sản phẩm:", error);
                setSearchResults([]);
                setNoResults(true);
            }
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
            setNoResults(false);
        }
    };
    
    // Xử lý khi nhấn Enter
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && input.trim() !== "") {
            window.location.href = `/search-results?query=${input.trim()}`;
        }
    };
    // Xử lý khi click nút tìm kiếm
    const handleSearchClick = () => {
        if (input.trim() !== "") {
            window.location.href = `/search-results?query=${input.trim()}`;
        }
    };

    return (
        <>
            <div className="Top-header">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12 col-12 header-logo">
                            <Link to={"/"}>
                                <img className="img-header"
                                    src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576" />
                            </Link>
                        </div>
                        <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 position-relative">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        handleChange(e.target.value);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                    placeholder="Bạn muốn tìm gì?"
                                    className="form-control"
                                />
                                <div className="input-group-text" type="button" onClick={handleSearchClick}>
                                    <CiSearch />
                                </div>
                            </div>

                            {/* Hiển thị gợi ý tìm kiếm dưới thanh input */}
                            {searchFocused && searchResults.length > 0 && (
                                <ul className="list-group position-absolute  shadow search-results-container">
                                    {searchResults.map((result) => (
                                        <li key={result.id} className="list-group-item p-2 search-result-item">
                                            <Link to={`/chi-tiet-san-pham/${result.id}`} className="search-result-link">
                                                <img src={result.imageUrl} alt={result.name} className="search-result-img" />
                                                <div className="ms-2">
                                                    <span className="search-result-name">{result.name}</span>
                                                    <p className="search-result-price">{formatCurrency(result.price)}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Không có kết quả */}
                            {searchFocused && searchResults.length === 0 && (
                                <p className="no-results-message position-absolute text-center bg-white p-2">
                                    Không có sản phẩm nào phù hợp
                                </p>
                            )}
                        </div>
                        <div className="col-xl-3 col-lg-4 box-right">
                            <div className="CTP">
                                <div className="icon-phone">
                                    <LuPhoneCall className="icon" />
                                </div>
                                <div className="content-phone">
                                    <span>Hỗ trợ 24/24</span><br />
                                    <span>19001005</span>
                                </div>

                            </div>
                            <div className="CTST">
                                <div className="icon-store">
                                    <HiOutlineBuildingStorefront className="icon" />
                                </div>
                                <div className="content-store">
                                    <span>Số hệ thống</span><br />
                                    <span>8 hệ thống</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ContentHeader />


        </>
    );
}

export default Header;