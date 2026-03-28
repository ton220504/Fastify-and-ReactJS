import { Carousel } from "react-bootstrap";
import Policy from "./policy";
import Popular from "./popular_categories";
import Follow from "./Follow";
import Banner from "./Banner";
import Deal from "./Deal";
import ProductiPhone from "./Product/ProductiPhone";
import ProductSamsung from "./Product/ProductSamsung";
import ToastMessage from "../ToastMessage";
import Post from "./Post";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ip } from "../../api/Api";
//import Deal from "./Deal";


const Home = () => {
    const [banner, setBanner] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const sideScrollRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getBanner = async () => {
        try {
            const response = await axios.get(`${ip}/banners`);
            const banners = response.data;

            const updatedBanners = banners.map((banner) => ({
                ...banner,
                imageUrl: banner.image
                    ? `${ip}/uploads/${banner.image}`
                    : "/images/default-placeholder.jpg"
            }));

            setBanner(updatedBanners);
        } catch (error) {
            console.log("Lỗi banner: ", error);
        }
    };

    useEffect(() => {
        getBanner();
    }, []);

    // Touch drag for side banners
    const handleTouchStart = (e) => {
        const el = sideScrollRef.current;
        if (!el) return;
        el._startX = e.touches[0].clientX;
        el._scrollLeft = el.scrollLeft;
    };
    const handleTouchMove = (e) => {
        const el = sideScrollRef.current;
        if (!el || !el._startX) return;
        const diff = el._startX - e.touches[0].clientX;
        el.scrollLeft = el._scrollLeft + diff;
    };

    const sideBanners = [
        "https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_1.jpg?1719291840576",
        "https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_2.jpg?1719291840576",
        "https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_3.jpg?1719291840576"
    ];

    return (
        <>
            <div className="banner container">
                {isMobile ? (
                    <>
                        {/* Mobile: Full-width carousel */}
                        <div className="mt-3">
                            <Carousel data-bs-theme="dark">
                                {banner.map((item) => (
                                    <Carousel.Item key={item.id || item.name}>
                                        <img
                                            className="d-block w-100"
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{ height: "220px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        {/* Mobile: Side banners as horizontal scroll */}
                        <div
                            className="side-banners-scroll mt-2"
                            ref={sideScrollRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                        >
                            {sideBanners.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`Promo ${idx + 1}`}
                                    className="side-banner-img"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    /* Desktop: Original layout */
                    <div className="row" id="container-banner">
                        <div className="col-9 banner-left mt-3">
                            <Carousel data-bs-theme="dark">
                                {banner.map((item) => (
                                    <Carousel.Item key={item.id || item.name}>
                                        <img
                                            className="d-block w-100"
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{ height: "402px" }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        <div className="col-3 banner-right mt-3">
                            {sideBanners.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    style={{ width: "330px" }}
                                    className={idx > 0 ? "mt-2" : ""}
                                    alt={`Promotional banner ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ToastMessage />
            <Policy />
            <Popular />
            <Deal />
            <Banner />
            <ProductiPhone />
            <ProductSamsung />
            {/* <Laptop/>
            <Cammera/>
            <Headphones/> */}
            <Post />

            <Follow />
        </>

    )
}

export default Home;