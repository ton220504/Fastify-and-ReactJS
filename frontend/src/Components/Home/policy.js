
import { Image } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";


const Policy = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const listPolicy = [
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_1.png?1719291840576", name: "Vẫn chuyển Miễn Phí", title: "Khu vực TPHCM" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_3.png?1719291840576", name: "Tiến hành thanh toán", title: "Với nhiều hình thức" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_2.png?1719291840576", name: "Đổi trả miễn phí", title: "Trong vòng 30 ngày" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_4.png?1719291840576", name: "100% hoàn tiền", title: "nếu sản phẩm lỗi" }
    ]

    // Touch drag handler
    const handleTouchStart = (e) => {
        const el = scrollRef.current;
        if (!el) return;
        el._startX = e.touches[0].clientX;
        el._scrollLeft = el.scrollLeft;
    };
    const handleTouchMove = (e) => {
        const el = scrollRef.current;
        if (!el || !el._startX) return;
        const diff = el._startX - e.touches[0].clientX;
        el.scrollLeft = el._scrollLeft + diff;
    };

    // Mouse drag handler
    const handleMouseDown = (e) => {
        const el = scrollRef.current;
        if (!el) return;
        el._isDown = true;
        el._startX = e.pageX;
        el._scrollLeft = el.scrollLeft;
        el.style.cursor = "grabbing";
    };
    const handleMouseMove = (e) => {
        const el = scrollRef.current;
        if (!el || !el._isDown) return;
        e.preventDefault();
        const diff = el._startX - e.pageX;
        el.scrollLeft = el._scrollLeft + diff;
    };
    const handleMouseUp = () => {
        const el = scrollRef.current;
        if (!el) return;
        el._isDown = false;
        el.style.cursor = "grab";
    };

    if (isMobile) {
        return (
            <div className="policy container">
                <div
                    className="policy-scroll-wrapper"
                    ref={scrollRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {listPolicy.map((item, index) => (
                        <div className="policy-scroll-item" key={index}>
                            <div className="icon-policy">
                                <Image src={item.icon} style={{ width: "35px" }} />
                            </div>
                            <div className="content-policy">
                                <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.name}</span><br />
                                <span style={{ fontSize: "11px" }}>{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="policy container">
            <div className="row ml-2">
                {listPolicy.map((item, index) => {
                    return (
                        <div className="col-3 content" key={index}>
                            <div className="icon-policy">
                                <Image src={item.icon} style={{ width: "40px" }} />
                            </div>
                            <div className="content-policy">
                                <span>{item.name}</span><br />
                                <span>{item.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
export default Policy;