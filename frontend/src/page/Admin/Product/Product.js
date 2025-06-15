import React, { useState, useEffect, useCallback, useRef } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";
import numeral from "numeral";




const Products = () => {
  // State hooks to replace class state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [product, setProduct] = useState([]);
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [imagesModalShow, SetImagesModalShow] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [addform, setAddform] = useState([{ id: 1 }]);
  const [image, setImage] = useState(null);
  const [colorName, setColorName] = useState('');
  const [price, setPrice] = useState('');
  const formatCurrency = (value) => {
    return numeral(value).format('0,0') + ' ₫';
  }; const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const proId = product.id;
    //console.log(proId);
    try {
      if (!image || !colorName || !price) {
        Swal.fire({
          toast: true,
          icon: "warning",
          position: "top-end",
          text: "Vui lòng nhập đầy thông tin!",
          timer: 2000,
          timerProgressBar: true
        })
        return;
      }
      // 1. Upload ảnh
      const imageForm = new FormData();
      imageForm.append("file", image);

      const uploadRes = await axios.post("http://localhost:3000/api/upload", imageForm);
      const imageName = uploadRes.data.filename;

      // 2. Tạo object sản phẩm chuẩn API yêu cầu
      const productData = {
        image_url: imageName,  // Đây là URL ảnh
        color_name: colorName,
        price: price,
        product_id: proId,
        //sort_order: sortOrder
      };

      // 3. Gửi lên API
      const response = await axios.post("http://localhost:3000/api/upload-images", productData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Image uploaded successfully:", response.data);
      Swal.fire({
        toast: true,
        icon: "success",
        position: "top-end",
        text: "Thêm ảnh thành công!",
        timer: 2000,
        timerProgressBar: true
      });
      OpenImagesModal(proId);
      setColorName('');
      setPrice('');
      setImage(null);
      //setProductId('');
      //setSortOrder('');
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        text: "Có lỗi khi thêm ảnh!",
      });
    }
  };


  // 🟢 Hàm gọi API lấy sản phẩm theo trang, ưu tiên sản phẩm có releaseDate sớm nhất
  const getProducts = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:3000/api/products?page=${pageNumber}&limit=${perPage}`
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
  //chi tiết
  const openDetailModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${id}`);
      const productDetails = response.data;

      // Gắn đường dẫn ảnh cho ảnh đại diện
      const updatedProduct = {
        ...productDetails,
        imageUrl: productDetails.image
          ? `http://127.0.0.1:3000/uploads/${productDetails.image}`  // Ảnh đại diện
          : "/images/default-placeholder.jpg",

        // Gắn đường dẫn ảnh cho ảnh liên quan
        variations: productDetails.images.map((img) => ({
          imageUrl: `http://127.0.0.1:3000/uploads/${img.url}`,  // Đường dẫn ảnh liên quan

        }))
      };

      // Cập nhật state với ảnh đại diện và ảnh liên quan
      setProduct(updatedProduct);
      setDetailModalShow(true);

    } catch (error) {
      console.error("Error fetching product details", error);
      Swal.fire({
        text: "Failed to fetch product details",
        icon: "error",
      });
    }
  };

  // open modal images
  // Mở modal ảnh liên quan
  const OpenImagesModal = async (id) => {
    try {
      if (!id) {
        throw new Error('Product ID is missing');
      }
      const response = await axios.get(`http://localhost:3000/api/products/${id}`);
      const productDetails = response.data;
      const updatedProduct = {
        ...productDetails,
        variations: productDetails.images.map((img) => ({
          imageUrl: `http://127.0.0.1:3000/uploads/${img.url}`,
          color: img.color,
          price: img.price
        }))
      };
      setProduct(updatedProduct);
      SetImagesModalShow(true);
    } catch (error) {
      console.error("Error fetching product details", error);
      Swal.fire({
        text: "Failed to fetch product details",
        icon: "error",
      });
    }
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
        Axios.delete(`http://localhost:3000/api/products/${id}/soft-delete`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => {
            Swal.fire({
              icon: "Thành công",
              title: "Xóa!",
              text: "Đã chuyển vào thùng rác!",
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
  //đóng modal chi tiết
  const closeProductDetailModal = () => {
    setDetailModalShow(false);
    setProduct([])
  }
  const closeImagesModal = () => {
    SetImagesModalShow(false);
    setAddform([{ id: 1 }]);
  }
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  //search
  const searchProducts = async (keyword, page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/products/search`, {
        params: {
          searchTerm: keyword,
          page: 1,
          limit: 10
        }
      });

      const { content = [], totalPages, currentPage } = response.data.data || {};

      // Kiểm tra dữ liệu nhận được từ API
      //console.log("Dữ liệu API:", response.data.products);

      setProducts(response.data.products);  // Cập nhật state sản phẩm
      setSearchResults(content);  // Cập nhật kết quả tìm kiếm
      setNoResults(content.length === 0);
      setTotalPages(totalPages);
      setCurrentPage(currentPage + 1);

      // Nếu cần xử lý thêm, bạn có thể thêm logic sau
      fetchImagesAndUpdateProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setProducts([]);  // Nếu có lỗi, đảm bảo reset lại products
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = async (value) => {
    const keyword = value.trim();  // Lọc khoảng trắng đầu và cuối

    setInput(value);  // Cập nhật input (chưa trim) cho việc hiển thị trực tiếp

    if (keyword.length >= 1) {
      setShowSearchResults(true);  // Hiển thị kết quả tìm kiếm

      try {
        await searchProducts(keyword, 1);  // Gọi tìm kiếm từ trang 1
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        // Có thể hiển thị thông báo lỗi nếu cần
      }
    } else {
      setShowSearchResults(false);  // Ẩn kết quả tìm kiếm nếu không có từ khóa
      setSearchResults([]);  // Reset kết quả tìm kiếm
      setNoResults(false);  // Đặt lại trạng thái không có kết quả
      getProducts(1);  // Reset lại danh sách sản phẩm gốc từ trang 1
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Tất cả sản phẩm</h6>
          <div>
            {/* <input
              placeholder="Tìm..."
              className="form-control"
              style={{ width: "140px" }}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            /> */}
            <Link to={'/admin/productCreate'} className="btn btn-success my-2 me-2 ">Thêm sản phẩm</Link>
            <Link to={'/admin/trashcan'} className="btn btn-danger my-2 me-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
            </svg>Thùng rác</Link>
          </div>
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
                        <Button variant="primary me-2 btn btn-primary"  >
                          <svg xmlns="http://www.w3.org/2000/svg" onClick={() => OpenImagesModal(product.id)} width="16" height="16" fill="currentColor" className="bi bi-plus-square-dotted" viewBox="0 0 16 16">
                            <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                          </svg>
                        </Button>
                        <Link to={`/admin/ProductEdit/${product.id}`} className="btn btn-success my-2 me-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                          </svg>
                        </Link>
                        <Button variant="success me-2 btn btn-warning" onClick={() => openDetailModal(product.id)} >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
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
      {/* modal chi tiết */}
      <Modal show={detailModalShow} onHide={closeProductDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Hiển thị thông tin của sản phẩm từ object product */}
          {product ? (
            <div>
              {/* Hiển thị hình ảnh */}
              <div><strong>Hình ảnh đại diện:</strong></div>
              <div>
                <img
                  height="60px"
                  width="60px"
                  src={product.imageUrl}
                  alt={product.name}
                />
              </div>
              <div><strong>Hình ảnh liên quan:</strong></div>
              <div>
                {product?.variations?.length > 0 ? (
                  product.variations.map((variation, index) => (
                    <img
                      key={index}
                      height="60px"
                      width="60px"
                      src={variation.imageUrl}
                      alt={`Ảnh liên quan ${variation.color}`}  // Cập nhật alt để rõ ràng hơn
                      onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                    />
                  ))
                ) : (
                  <div>Không có ảnh liên quan</div>
                )}
              </div>

              {/* Hiển thị thông tin chi tiết sản phẩm */}
              <div><strong>Tên sản phẩm: </strong> {product.name}</div>
              <div><strong>Giá: </strong> {formatCurrency(product.price)}</div>
              <div><strong>Mô tả: </strong> {product.description}</div>
              <div><strong>Số lượng tồn kho: </strong> {product.stockQuantity}</div>
              <div><strong>Loại: </strong>{product.category}</div>
              <div><strong>Thương hiệu: </strong>{product.brand}</div>
              <div><strong>Ngày nhập vào: </strong>{new Date(product.releaseDate).toLocaleString()}</div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductDetailModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {/*modal ảnh*/}
      <Modal size="lg" show={imagesModalShow} onHide={closeImagesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ảnh liên quan</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>Hình ảnh:</strong>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {product?.variations?.length > 0 ? (
                  product.variations.map((variation, index) => (
                    <div style={{
                      margin: '10px', // Khoảng cách giữa các item
                      fontSize: "10px",
                      fontWeight:"bold"
                    }}>
                      <img
                        key={index}
                        height="60px"
                        width="60px"
                        src={variation.imageUrl}
                        alt={`Ảnh liên quan ${variation.color}`}  // Cập nhật alt để rõ ràng hơn
                        onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                      />
                      <p>{variation.color}</p>
                      <p>{formatCurrency(variation.price)}</p>
                    </div>
                  ))
                ) : (
                  <div>Không có ảnh liên quan</div>
                )}
              </div>
            </div>
            <div >
              <strong>Thêm ảnh liên quan</strong>
              {addform.map((form, index) => (
                <div className="form-control mb-2" key={form.id} style={{ width: "300px" }} >
                  <input
                    className="form-control mb-2"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
                  <input
                    placeholder="thêm màu"
                    className="form-control mb-2"
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    required
                  />
                  <input
                    placeholder="Thêm giá"
                    className="form-control mb-2"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />

                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImagesModal}>
            Đóng
          </Button>
          <Button onClick={handleSubmit}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Products;
