import { Link } from "react-router-dom";
import "../../scss/Delivery.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import { ip } from "../../api/Api";
const Sidebar = ({ onSelect, selectedTab }) => {
    return (
        <div className="sidebar">
            <ul className="menu">
                <li style={{cursor:"pointer"}} className={selectedTab ==="profile"?"active":""} onClick={() => onSelect("profile")}>Tài Khoản Của Tôi</li>
                <li style={{cursor:"pointer"}} className={selectedTab==="orders"?"active":""} onClick={() => onSelect("orders")}>Đơn Mua</li>
            </ul>
        </div>
    );
};

export default Sidebar;