import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import ToastMessage from '../ToastMessage';

const Individual = () => {
    const [user, setUser] = useState({});
    //const [editUser, setEditUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isEditPass, setEditPass] = useState(false);
    const [isEditCreatePass, setEditCreatePass] = useState(false);
    const [isCreate, setCreate] = useState(true);
    const [editUser, setEditUser] = useState({ id: "", username: "", email: "", password: "", phone: "", address: "", role: "" });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [createPassword, setCreatePassword] = useState('');


    const dispatch = useDispatch();
    const getUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem("user");
            const userObj = userString ? JSON.parse(userString) : null;

            const response = await axios.get(`http://127.0.0.1:3000/api/users/${userObj.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const userData = response.data;
            // Xoá password trước khi set vào editUser
            const { password, ...userWithoutPassword } = userData;
            setUser(userData);
            setEditUser(userWithoutPassword); // cũng gán vào form chỉnh sửa
            // ✅ Thông báo toast tương ứng
            if (!userData.password) dispatch({ type: "ADD_TOAST", message: "Chưa có mật khẩu, vui lòng cập nhật!" });
            if (!userData.phone) dispatch({ type: "ADD_TOAST", message: "Chưa có số điện thoại, vui lòng cập nhật!" });
            if (!userData.address) dispatch({ type: "ADD_TOAST", message: "Chưa có địa chỉ, vui lòng cập nhật!" });
        } catch (error) {
            console.log("lỗi khi gọi user", error)
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleUpdateUser = async () => {
        const token = localStorage.getItem("token");
        try {
            const requestBody = {
                username: editUser.username,
                email: editUser.email,
                address: editUser.address,
                phone: editUser.phone,
                role: editUser.role,
            };

            if (editUser.password && editUser.password.trim() !== "") {
                requestBody.password = editUser.password;
            }


            await axios.put(
                `http://localhost:3000/api/users/${editUser.id}`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Cập nhật thành công!',
                timer: 2000,
                timerProgressBar: true
            });

            setIsEditing(false);
            getUser();

        } catch (error) {
            console.error("Error updating user", error);
            Swal.fire({ text: "Cập nhật thất bại", icon: "error" });
        }
    };
    const handleUpdatePass = async () => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!oldPassword) {
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Vui lòng nhập mật khẩu cũ!',
                timer: 2000,
                timerProgressBar: true
            })
            return;
        }
        if (!newPassword) {
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Vui lòng nhập mật khẩu mới!',
                timer: 2000,
                timerProgressBar: true
            })
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3000/api/users/${user.id}/password`, { oldPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Cập nhật thành công!',
                timer: 2000,
                timerProgressBar: true
            });
            setEditPass(false);
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            const mes = error.response.data.error;
            Swal.fire({
                toast: true,
                icon: 'error',
                position: "top-end",
                title: mes,
                timer: 2000,
                timerProgressBar: true
            });
        }

    }
    const handlecreatePass = async () => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!createPassword) {
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Vui lòng nhập mật khẩu mới!',
                timer: 2000,
                timerProgressBar: true
            })
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3000/api/users/${user.id}/createpassword`, { createPassword }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Cập nhật thành công!',
                timer: 2000,
                timerProgressBar: true
            });
            setCreate(false);
            setEditCreatePass('');
        } catch (error) {
            const mes = error.response.data.error;
            Swal.fire({
                toast: true,
                icon: 'error',
                position: "top-end",
                title: mes,
                timer: 2000,
                timerProgressBar: true
            });
        }

    }
    return (
        <div>

            <div className='form-control' style={{ width: "400px" }}>
                {isEditing ? (
                    <>
                        <label>Tên khách hàng:</label>
                        <input
                            className='form-control mb-2'
                            value={editUser.username || ""}
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        />

                        <label>Email:</label>
                        <input
                            className='form-control mb-2'
                            value={editUser.email || ""}
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        />

                        <label>Điện thoại:</label>
                        <input
                            className='form-control mb-2'
                            value={editUser.phone || ""}

                            onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                        />

                        <label>Địa chỉ:</label>
                        <input
                            className='form-control mb-2'
                            value={editUser.address || ""}
                            onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                        />

                    </>
                ) : (
                    <>
                        <p style={{ display: "flex", justifyContent: "space-between" }}>
                            Tên khách hàng: <strong>{user.username}</strong>
                        </p>
                        <p style={{ display: "flex", justifyContent: "space-between" }}>
                            Email: <strong>{user.email}</strong>
                        </p>
                        <p style={{ display: "flex", justifyContent: "space-between" }}>
                            Điện thoại: {user.phone ? (<strong>{user.phone}</strong>) : (<span style={{ color: "red", fontStyle:"italic" }}>Vui lòng cập nhật thông tin</span>)}
                        </p>
                        <p style={{ display: "flex", justifyContent: "space-between" }}>
                            Địa chỉ: {user.address ? (<strong>{user.address}</strong>) : (<span style={{ color: "red", fontStyle:"italic" }}>Vui lòng cập nhật thông tin</span>)}
                        </p>
                        {isCreate ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>

                                {user.password ? (<>
                                    <div onClick={() => { setEditPass(true) }} style={{ cursor: "pointer", fontWeight: "bold" }}>Đổi mật khẩu</div>
                                    {isEditPass ? (<div className='form-control' style={{ width: "370px" }}>
                                        <label>Nhập mật khẩu cũ:</label>
                                        <input
                                            className='form-control mb-2'
                                            type='password'
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                        <label>Nhập mật khẩu mới:</label>
                                        <input
                                            className='form-control mb-2'
                                            type='password'
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                            <button onClick={handleUpdatePass} className='form-control' style={{ backgroundColor: "green", color: "white", width: "600px" }}>Lưu</button>
                                            <button onClick={() => { setEditPass(false) }} className='form-control' style={{ backgroundColor: "gray", color: "white" }}>Đóng</button>
                                        </div>
                                    </div>) : ("")}
                                </>) : (<span onClick={() => { setEditCreatePass(true) }} style={{ color: "gray", cursor: "pointer", fontStyle:"italic" }}>Vui lòng thêm mật khẩu để tăng tính bảo mật</span>)}
                            </div>) : (<></>)}

                        {isEditCreatePass ? (<div className='form-control' style={{ width: "370px" }}>
                            <label>Nhập mật khẩu mới:</label>
                            <input
                                className='form-control mb-2'
                                type='password'
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}

                            />
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button onClick={handlecreatePass} className='form-control' style={{ backgroundColor: "green", color: "white", width: "600px" }}>Lưu</button>
                                <button onClick={() => { setEditCreatePass(false) }} className='form-control' style={{ backgroundColor: "gray", color: "white" }}>Đóng</button>
                            </div>


                        </div>) : ("")}
                    </>
                )}
            </div>


            {isEditing ? (
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                        onClick={handleUpdateUser}
                        style={{ width: "200px", marginTop: "15px", backgroundColor: "#28a745", color: "white" }}
                        className='form-control'
                    >
                        Lưu thông tin
                    </button>
                    <button
                        onClick={()=>{setIsEditing(false)}}
                        style={{ width: "190px", marginTop: "15px", backgroundColor: "gray", color: "white" }}
                        className='form-control'
                    >
                        Đóng
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ width: "200px", marginTop: "15px", backgroundColor: "#503eb6", color: "white" }}
                    className='form-control'
                >
                    Thay đổi thông tin
                </button>
            )}
        </div>
    );
};

export default Individual;
