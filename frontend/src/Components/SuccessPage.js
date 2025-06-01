import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/'); // Redirect về trang chủ hoặc dashboard
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Đang xử lý đăng nhập...</h1>
    </div>
  );
}

export default SuccessPage;
