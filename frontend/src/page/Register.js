import { Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ComeBack from "../Components/ComeBack";
import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { ip } from "../api/Api";

const Register = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi từ server
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Xóa thông báo lỗi trước đó
        if (!name) {
            setErrorMessage("Bạn phải nhập tên.");
            setLoading(false);
            return;
        }
        if (!email) {
            setErrorMessage("Bạn phải nhập email.");
            setLoading(false);
            return;
        }
        if (!phone) {
            setErrorMessage("Bạn phải nhập số điện thoại.");
            setLoading(false);
            return;
        }
        if (!password) {
            setErrorMessage("Bạn phải nhập mật khẩu.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải dài ít nhất 6 ký tự.");
            setLoading(false);
            return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }


        axios
            .post("http://127.0.0.1:3000/api/users", {
                username: name,
                email: email,
                phone: phone,
                password: password,
                password_confirmation: passwordConfirm,
                address: "string", // địa chỉ mặc định
                role: "user"       // role mặc định là user
            })
            .then((result) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/login");
                });

                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response) {
                    const { status, data } = err.response;
                    console.error("Lỗi chi tiết:", data);
            
                    if (status === 422) {
                        setErrorMessage("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
                    } else if (status === 409) {
                        setErrorMessage("Email này đã tồn tại.");
                    } else if (status === 500) {
                        setErrorMessage("Lỗi máy chủ. Vui lòng thử lại sau.");
                    } else {
                        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
                    }
                } else {
                    setErrorMessage("Không thể kết nối đến máy chủ.");
                }
            });


    }

    function handleChange(e) {
        if (e.target.name === "name") setName(e.target.value);
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "phone") setPhone(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);
        if (e.target.name === "password_confirmation") setPasswordConfirm(e.target.value);
    }

    return (
        <>
            <ComeBack />
            <Form className="mt-5 Login auth" onSubmit={handleSubmit}>
                <div className="content-login">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            className="img-header"
                            src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576"
                            style={{ width: "200px", marginBottom: "10px" }}
                            alt="Logo"
                        />
                    </div>
                    <h4 className="text-center">Đăng kí</h4>
                    <div className="text-center mb-3">
                        <span>Có tài khoản đăng nhập
                            <Link to="/login" className="text-primary"> tại đây</Link>
                        </span>
                    </div>

                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger text-center">
                            {errorMessage}
                        </div>
                    )}

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control type="name" name="name" placeholder="Tên..." onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Email..." onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control type="phone" name="phone" placeholder="Số điện thoại..." onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Mật khẩu..." onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                        <Form.Label>Nhập lại mật khẩu</Form.Label>
                        <Form.Control type="password" name="password_confirmation" placeholder="Nhập lại mật khẩu..." onChange={handleChange} />
                    </Form.Group>
                </div>
                <div className="button p-3">
                    <Button className="signin form-control" type="submit" disabled={loading}>
                        {loading ? (
                            <div className="align-middle">
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span>Đăng ký...</span>
                            </div>
                        ) : (
                            <span>Đăng ký</span>
                        )}
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default Register;
