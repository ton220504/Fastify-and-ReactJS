import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ip } from '../../api/Api';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${ip}/posts`);
                const po = response.data || [];
                const updatedPost = po.map((pos) => ({
                    ...pos,
                    imageUrl: pos.image ? `${ip}/uploads/${pos.image}` : "/images/default-placeholder.jpg"
                }));
                setPosts(updatedPost);
            } catch (error) {
                console.error(error);
                setPosts([]);
            }
        };
        fetchPosts();
    }, []);

    const displayedPosts = posts.slice(0, 6); // Lấy 6 bài cho scroll mobile

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h4 className='m-0' style={{ fontWeight: "bold" }}>Tất cả bài viết</h4>
                    <Link to="/tat-ca-bai-viet" style={{ color: "#503eb6", textDecoration: "none", fontSize: "14px" }}>Xem tất cả</Link>
                </div>
                <section className="maincontent mb-3">
                    <div className={isMobile ? "modern-scroll-wrapper" : "row"}>
                        {displayedPosts.map((post) => (
                            <div key={post.id}
                                className={isMobile ? "modern-scroll-item" : "col-md-4 mb-4"}
                                style={isMobile ? { width: "280px" } : {}}>
                                <div className="rounded-4 border bg-white shadow-sm overflow-hidden" style={{ height: "100%" }}>
                                    <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                        <img
                                            src={post.imageUrl}
                                            style={{ height: "180px", width: "100%", objectFit: "cover" }}
                                            alt={post.name}
                                        />
                                    </Link>
                                    <div className="p-3 d-flex flex-column" style={{ height: "calc(100% - 180px)" }}>
                                        <h5 style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            WebkitLineClamp: 2,
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            marginBottom: "15px"
                                        }}>{post.title}</h5>
                                        <Link to={`/chi-tiet-bai-viet/${post.id}`}
                                            className="btn btn-sm mt-auto"
                                            style={{ color: "white", backgroundColor: "#503eb6", borderRadius: "8px" }}>
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Post;
