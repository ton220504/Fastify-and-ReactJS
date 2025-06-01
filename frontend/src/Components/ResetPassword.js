import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ResetPassword() {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const email = localStorage.getItem("resetEmail");
    //console.log(email);
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (otp.length !== 6) {
            Swal.fire("Lỗi", "Mã OTP phải có 6 chữ số!", "error");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            Swal.fire("Lỗi", "Mật khẩu không khớp!", "error");
            return;
        }
    
        try {
            Swal.showLoading();
            await axios.post("http://localhost:3000/reset-password", {
                email: email,
                otp: otp,
                newPassword: newPassword,
            });
            
            Swal.close();
    
            Swal.fire({
                icon: "success",
                title: "Đặt lại mật khẩu thành công!",
                confirmButtonText: "OK",
            }).then(() => {
                localStorage.removeItem("resetEmail");
                navigate("/login");
            });
    
        } catch (error) {
            Swal.close();
            console.error("Lỗi đặt lại mật khẩu:", error);
            Swal.fire("Lỗi", "Mã OTP không đúng hoặc đã hết hạn!", "error");
        }
    };
    

    return (
        <Form onSubmit={handleSubmit} className="container mt-5" style={{ maxWidth: "400px" }}>
            <h4>Đặt lại mật khẩu</h4>
            <Form.Group className="mb-3">
                <Form.Label>Mã OTP</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Xác nhận lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit" variant="success" className="form-control">
                Đặt lại mật khẩu
            </Button>
        </Form>
    );
}

export default ResetPassword;
