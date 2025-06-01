import { Link, useLocation } from "react-router-dom";

const pageNames = {
    "gio-hang": "Giỏ hàng",
    "yeu-thich": "Yêu thích",
    "tat-ca-san-pham": "Tất cả sản phẩm",
    "thong-tin": "Thông tin",
    "san-pham-theo-loai": "Sản phẩm theo loại",
    "chi-tiet-bai-viet": "Bài viết",
    "chi-tiet-san-pham": "Chi tiết sản phẩm",
    "search-results":"Tìm kiếm",
    "login":"Đăng nhập",
    "dangki":"Đăng ký",
};

const ComeBack = () => {
    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);

    const currentKey = pathParts[0];
    const currentPage = pageNames[currentKey] || "Trang con";

    return (
        <div className="my-comeback">
            <div className="container">
                <Link to="/">Trang chủ</Link>
                {currentKey && (
                    <>
                        {" / "}
                        <span style={{ fontStyle: "italic" }}>{currentPage}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ComeBack;
