import { useState } from "react";
import { FaInstagram } from "react-icons/fa";

const Banner = () => {
    const [banner, setBanner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },

    ])

    return (
        <>
            <div className="banner-bg">
                <div className="content container">
                    {banner.map((item, index) => {
                        return (
                            <div className="col-4 mt-4" key={item.id}>
                                <div>
                                    <img src={item.img} className="image" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
        </>
    );
}
export default Banner;