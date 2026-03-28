import { useState, useEffect } from "react";

const Follow = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const followImages = [
        "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/image_ins_1.jpg?1719291840576",
        "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/image_ins_2.jpg?1719291840576",
        "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/image_ins_3.jpg?1719291840576",
        "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/image_ins_4.jpg?1719291840576",
        "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/image_ins_5.jpg?1719291840576"
    ];

    return (
        <div className="Follow container text-center mt-5 mb-5">
            <h4 className="mb-4" style={{ fontWeight: "bold" }}>Theo dõi chúng tôi</h4>
            <div className={isMobile ? "modern-scroll-wrapper" : "d-flex justify-content-center gap-3 overflow-hidden"}>
                {followImages.map((src, idx) => (
                    <div className={isMobile ? "modern-scroll-item" : "flex-item"} 
                         key={idx}
                         style={isMobile ? { width: "180px", flexShrink: 0 } : { flex: "1" }}>
                        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #eee", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                            <img src={src} 
                                 alt={`follow_${idx + 1}`} 
                                 style={{ width: "100%", height: "auto", display: "block", aspectRatio: "1/1", objectFit: "cover" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Follow;