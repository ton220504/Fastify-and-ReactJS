import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Post = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts`);
            //console.log('Fetched posts:', response.data);
            setPosts(response.data || []);
            const po = response.data;
            fetchImagesPost(po)
        } catch (error) {
            console.error('Error fetching posts', error);
            setPosts([]);
        }
    };
    const fetchImagesPost = async (po) => {
        if (!po || po.length === 0) return;

        const updatedPost = po.map((pos) => {
            //console.log("Image name:", pos.image);
            const imageUrl = pos.image
                ? `http://127.0.0.1:3000/uploads/${pos.image}`
                : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có

            return { ...pos, imageUrl };
        });

        setPosts(updatedPost);
    };
    useEffect(() => {
        fetchPosts();
    }, []);

    // Lấy 3 bài viết đầu tiên
    const displayedPosts = posts.slice(0, 3);

    return (
            <div className='container'>
                <div className='row'>
                    <h4 className='my-2'>Tất cả bài viết</h4>
                    <section className="maincontent my-3">
                        <div className="row">
                            {displayedPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="col-md-4 mb-4"
                                >
                                    <div className="rounded-4 border bg-white shadow" style={{ height: "100%" }}>
                                        <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                            <img
                                                src={post.imageUrl}
                                                style={{
                                                    height: "200px",
                                                    width: "100%",
                                                    borderTopLeftRadius: "15px",
                                                    borderTopRightRadius: "15px"
                                                }}
                                                className="border"
                                                alt={post.name}
                                            />
                                        </Link>
                                        <div className="p-2 d-flex flex-column" style={{ height: "40%" }}>
                                            <h5 style={{
                                                display: "-webkit-box",  // 🔹 Đặt trong dấu ngoặc kép
                                                WebkitBoxOrient: "vertical",  // 🔹 Đúng cú pháp camelCase
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 2,  // 🔹 Số dòng tối đa trước khi cắt
                                                fontWeight: "bold",
                                            }}>{post.title}</h5>
                                            <Link to={`/chi-tiet-bai-viet/${post.id}`} className="btn " style={{ color: "white", backgroundColor: "#503eb6", marginTop: "auto", marginBottom: "8px", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>Xem chi tiết</Link>
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
