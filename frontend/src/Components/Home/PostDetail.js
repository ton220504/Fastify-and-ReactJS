import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ip } from '../../api/Api';
import ComeBack from '../ComeBack';

const PostDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [posts, setPosts] = useState([]); // Tất cả các bài viết
    const [currentPost, setCurrentPost] = useState(null); // Bài viết hiện tại
    const [topic, setTopic] = useState([]);
    const [comments, setComments] = useState([]); // Danh sách bình luận
    const [newComment, setNewComment] = useState({ content: '' }); // Giá trị bình luận mới

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts`);
            console.log('Fetched posts:', response.data);
            const po = response.data;
            const updatedPost = po.map((pos) => {
                //console.log("Image name:", pos.image);
                const imageUrl = pos.image
                    ? `http://127.0.0.1:3000/uploads/${pos.image}`
                    : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có

                return { ...pos, imageUrl };
            });
            setPosts(updatedPost);
        } catch (error) {
            console.error('Error fetching posts', error);
            setPosts([]);
        }
    };

    const fetchPostDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts/${id}`);
            console.log('Fetched post detail:', response.data);
            const po = response.data;
            const updatedPost = () => {
                //console.log("Image name:", pos.image);
                const imageUrl = po.image
                    ? `http://127.0.0.1:3000/uploads/${po.image}`
                    : "/images/default-placeholder.jpg"; // ảnh mặc định nếu không có

                return { ...po, imageUrl };
            };
            setCurrentPost(updatedPost);
        } catch (error) {
            console.error('Error fetching post detail', error);
            setCurrentPost(null);
        }
    };

    const fetchTopic = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:3000/api/topics")
            const top = response.data;
            setTopic(top);
        } catch (error) {
            console.log("Lỗi call Topic: ", error);
        }
    }
    const fetchPostComment = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3000/api/postsComment/post/${id}`)
            const com = response.data;
            setComments(com);
        } catch (error) {
            console.log("Lỗi call Topic: ", error);
        }
    }
    useEffect(() => {
        fetchPosts();
        fetchPostDetail();
        fetchTopic()
        fetchPostComment()
    }, [id]); // Gọi API mỗi khi id thay đổi

    const handleDanhgia = async (event) => {
        event.preventDefault();
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        try {
            await axios.post(
                "http://127.0.0.1:3000/api/posts/comment",
                {
                    user_id: user.id,              // ✅ Gửi số
                    content: newComment.content,
                    post_id: id                    // ✅ Gửi số
                }
            );
            fetchPostComment();
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };

    const handleTopicChange = async (e) => {
        const selectedId = e.target.value;

        if (selectedId === "all") {
            fetchPosts();
        } else {
            try {
                const res = await axios.get(`http://127.0.0.1:3000/api/posts/topicId/${selectedId}`);
                const filteredPosts = res.data.map((pos) => {
                    const imageUrl = pos.image
                        ? `http://127.0.0.1:3000/uploads/${pos.image}`
                        : "/images/default-placeholder.jpg";
                    return { ...pos, imageUrl };
                });
                setPosts(filteredPosts);
            } catch (error) {
                console.error("Lỗi khi lọc post theo topic:", error);
            }
        }
    };

    if (!currentPost) {
        return <div>Loading...</div>; // Hiển thị loading nếu chưa có dữ liệu
    }

    return (
        <>
            <ComeBack />
            <div className='container' style={{ height: "100%" }}>
                <div className='row'>
                    <div className='col-4'>
                        {/* <h4 className='my-2'>Tất cả bài viết</h4> */}
                        <select className='form-control mt-3' onChange={handleTopicChange}>
                            <option value="all">Tất cả sản phẩm</option>
                            {topic.map((to, index) => (
                                <option key={index} value={to.id}>{to.name}</option>
                            ))}
                        </select>

                        <section className="maincontent my-3 " style={{ maxHeight: "900px", overflowY: "auto", paddingRight: "10px" }}>
                            {posts.length === 0 ? (
                                <p
                                    className="text-center rounded p-2"
                                    style={{
                                        fontSize: "15px",
                                        fontStyle: "oblique",
                                        color: "rgb(54, 57, 5)",
                                        backgroundColor: "rgb(245, 245, 148)"
                                    }}
                                >
                                    Không có bài viết nào thuộc chủ đề này.
                                </p>) : (
                                posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-4 border m-1 bg-white shadow"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setCurrentPost(post)}
                                    >
                                        <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                            <img src={post.imageUrl} style={{ height: "200px", width: "100%" }} className="rounded-4 border" alt={post.name} />
                                        </Link>
                                        <p className="mx-1">
                                            {post.title}
                                        </p>

                                    </div>
                                ))
                            )}
                        </section>
                    </div>
                    <div className='col-8'>
                        <h2 className='my-2'>{currentPost.name}</h2>
                        <img src={currentPost.imageUrl} style={{ height: "500px", width: "800px" }} className="rounded-4 border my-2" alt={currentPost.name} />
                        <p>{currentPost.detail}</p>
                        <Link to="/" className="btn btn-secondary mt-3">Quay lại</Link> {/* Nút quay lại trang danh sách */}
                        <div className="my-4">
                            <h5>Viết bình luận của bạn:</h5>
                            <form onSubmit={handleDanhgia} className="border p-3 rounded">

                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        placeholder="Nội dung"
                                        rows="3"
                                        value={newComment.content}
                                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button className="btn btn-primary" type="submit">Gửi thông tin</button>
                            </form>
                            <div className="comments mt-4">
                                <h6>Bình luận ({comments.length})</h6>
                                {comments.map(comment => (
                                    <div key={comment.id} className="comment my-2 border p-2 rounded">
                                        <strong>{comment.user_name} ({comment.user_email})</strong>
                                        <p>{comment.content}</p>
                                        <small>{comment.date}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDetail;
