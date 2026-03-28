import { useState, useEffect } from "react";
import { FaInstagram } from "react-icons/fa";

const Banner = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [banner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },
    ])

    return (
        <div className="banner-bg">
            <div className={`content container ${isMobile ? "modern-scroll-wrapper" : ""}`}>
                {banner.map((item, index) => (
                    <div className={isMobile ? "modern-scroll-item" : "col-4 mt-4"} 
                         key={item.id}
                         style={isMobile ? { width: "85%", flexShrink: 0 } : {}}>
                        <div style={{ borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                            <img src={item.img} alt="banner" className="image" style={{ width: "100%", height: "auto", display: "block" }} />
                            <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#fff", borderRadius: "50%", padding: "5px", color: "#503eb6", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default Banner;