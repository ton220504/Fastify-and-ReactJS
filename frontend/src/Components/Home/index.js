import { Carousel } from "react-bootstrap";
import Policy from "./policy";
import Popular from "./popular_categories";
import Follow from "./Follow";
import Banner from "./Banner";
import ProductiPhone from "./Product/ProductiPhone";
import ProductSamsung from "./Product/ProductSamsung";
import Laptop from "./Product/Laptop";
import Cammera from "./Product/Cammera";
import Headphones from "./Product/Headphones";
import ToastMessage from "../ToastMessage";
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";
//import Deal from "./Deal";


const Home = () => {
    const [banner, setBanner] = useState([]);

    const getBanner = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:3000/api/banners");
            const banners = response.data;

            const updatedBanners = banners.map((banner) => ({
                ...banner,
                imageUrl: banner.image
                    ? `http://127.0.0.1:3000/uploads/${banner.image}`
                    : "/images/default-placeholder.jpg"
            }));

            setBanner(updatedBanners); // Gán đúng
        } catch (error) {
            console.log("Lỗi banner: ", error);
        }
    };

    useEffect(() => {
        getBanner();
    }, []);

    return (
        <>
            <div className="banner container">
                <div className="row" id="container-banner">
                    <div className="col-9 banner-left mt-3" >
                        <Carousel data-bs-theme="dark">
                            {banner.map((item) => (
                                <Carousel.Item key={item.id || item.name} >
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

                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_1.jpg?1719291840576"
                            style={{ width: "330px" }} className="" />
                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_2.jpg?1719291840576"
                            style={{ width: "330px" }} className="mt-2" />
                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_3.jpg?1719291840576"
                            style={{ width: "330px" }} className="mt-2" />

                    </div>

                </div>

            </div>
            <ToastMessage />
            <Policy />
            <Popular />
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