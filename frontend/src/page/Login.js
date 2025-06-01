import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ComeBack from "../Components/ComeBack";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ip } from "../api/Api";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [editModalShow, setEditModalShow] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");

    const navigate = useNavigate();


    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Clear previous error

        axios
            .post("http://127.0.0.1:3000/api/users/login", {
                email,
                password,
            })
            .then((result) => {
                const { jwt, user } = result.data;
                console.log(result.data);

                if (jwt) {
                    // Lưu token và thông tin người dùng vào localStorage
                    localStorage.setItem("token", jwt);
                    localStorage.setItem("user", JSON.stringify(user));

                    Swal.fire({
                        icon: "success",
                        title: "Đăng nhập thành công!",
                        confirmButtonText: "OK",
                    }).then(() => {
                        navigate("/"); // Chuyển hướng
                        window.location.reload();
                    });
                } else {
                    setErrorMessage("Không tìm thấy token. Vui lòng thử lại!");
                }
            })
            .catch((err) => {
                setLoading(false);
                if (err.response) {
                    console.error("Lỗi API:", err.response.data);
                    if (err.response.status === 400 || err.response.status === 422) {
                        setErrorMessage("Email hoặc mật khẩu không chính xác.");
                    } else {
                        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
                    }
                } else {
                    setErrorMessage("Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng.");
                }
            });
    }


    function handleChange(e) {
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);

    }
    useEffect(() => {
        // Load Google Identity script
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: "868723265725-jfhktq3r7mcqt3qca18bptrgt44eqvgs.apps.googleusercontent.com",
                    callback: handleGoogleResponse,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin"),
                    { theme: "outline", size: "large", width: "100%" }
                );
            }
        };
    }, []);

    const handleGoogleResponse = async (response) => {
        try {
            const res = await axios.post("http://localhost:3000/auth/google", {
                token: response.credential,
            });

            const { jwt, user } = res.data;
            localStorage.setItem("token", jwt);
            localStorage.setItem("user", JSON.stringify(user));

            console.log(res);
            Swal.fire({
                icon: "success",
                title: "Đăng nhập thành công!",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
                window.location.reload();
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Lỗi đăng nhập bằng Google",
                text: "Vui lòng thử lại sau.",
            });
        }
    };
    const closeEditModal = () => {
        setEditModalShow(false);
    };
    const openEditModal = () => {
        setEditModalShow(true);
    };
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!forgotEmail) {
            Swal.fire("Lỗi", "Vui lòng nhập email!", "error");
            return;
        }
        try {
            Swal.showLoading(); // Show loading

            await axios.post(`http://localhost:3000/forgot-password`, {
                email: forgotEmail,
            });
            

            Swal.close(); // Đóng loading

            Swal.fire("Thành công", "Đã gửi mã xác thực về email!", "success").then(() => {
                localStorage.setItem("resetEmail", forgotEmail);
                navigate("/reset-password");
                closeEditModal();
            });

        } catch (err) {
            Swal.close();
            console.error("Lỗi gửi OTP:", err);
            Swal.fire("Lỗi", "Gửi OTP thất bại. Vui lòng thử lại sau!", "error");
        }

    };
    return (
        <>
            <ComeBack />
            <Form className="mt-5 Login" onSubmit={handleSubmit}>
                <div className="content-login">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            className="img-header"
                            src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576"
                            style={{ width: "200px", marginBottom: "10px" }}
                            alt="Logo"
                        />
                    </div>

                    <h4 className="text-center">Đăng nhập</h4>
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger text-center">
                            {errorMessage}
                        </div>
                    )}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Email..." onChange={handleChange} />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Mật khẩu..." onChange={handleChange} />
                    </Form.Group>
                    <Link className="forgot text-primary" onClick={openEditModal}>Quên mật khẩu?</Link>
                    <Link to="/dangki" className="register text-primary">Đăng kí tại đây</Link>

                </div>
                <div className="button p-3">
                    <Button className="signin form-control" type="submit">
                        {loading ? (
                            <div className="align-middle">
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span>Đăng nhập...</span>
                            </div>
                        ) : (
                            <span>Đăng nhập</span>
                        )}
                    </Button>
                    <div id="google-signin" className="mt-3"></div>

                </div>


            </Form>
            {/* Modal ra ngoài Form chính */}
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Body>
                    <div className="container">
                        <h2>Quên mật khẩu</h2>
                        <Form onSubmit={handleForgotPassword}>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                                className="mb-2"
                            />
                            <Button type="submit" className="btn-submit form-control mb-2">
                                Gửi mã xác thực
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="btn-back form-control"
                                onClick={closeEditModal}
                            >
                                Quay lại
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>



    );
}
export default Login;