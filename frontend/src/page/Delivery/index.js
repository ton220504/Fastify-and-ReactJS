import ComeBack from "../../Components/ComeBack";
import OrderSection from "./OrderSection ";
import Sidebar from "./Sidebar";
import Individual from "../../Components/Home/Individual";
import { useState } from "react";

const Delivery = () => {
    const [selectedTab, setSelectedTab] = useState("orders"); // mặc định hiển thị đơn mua

    return (
        <>
            <ComeBack />
            <div className="d-flex container mt-5 border">
                {/* Sidebar */}
                <Sidebar onSelect={setSelectedTab} selectedTab={selectedTab} />

                {/* Nội dung bên phải */}
                <div className="flex-grow-1 p-3" style={{ minHeight: "400px" }}>
                    {selectedTab === "orders" && <OrderSection />}
                    {selectedTab === "profile" && <Individual />}
                </div>
            </div>
        </>
    );
};

export default Delivery;
