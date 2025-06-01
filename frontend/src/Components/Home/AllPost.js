import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllPost = () => {
    const [posts, setPosts] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Topics và Posts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topicsRes, postsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:3000/api/topics'),
                    axios.get('http://127.0.0.1:3000/api/posts')
                ]);

                const postsWithImageUrl = postsRes.data.map(post => ({
                    ...post,
                    imageUrl: post.image
                        ? `http://127.0.0.1:3000/uploads/${post.image}`
                        : '/images/default-placeholder.jpg'
                }));

                setTopics(topicsRes.data);
                setPosts(postsWithImageUrl);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderPostsByTopic = (topicId) => {
        return posts
            .filter(post => post.topic_id === topicId && post.status === 2)
            .map(post => (
                <div key={post.id} className="post-card">
                    <img src={post.imageUrl} alt={post.title} className="post-image" />
                    <h4>{post.title}</h4>
                    <p>{post.description}</p>
                </div>
            ));
    };

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    return (
        <div className="all-posts-container">
            <h2>Tất cả bài viết</h2>

            {posts.filter(p => p.status === 2).map(post => (
                <div key={post.id} className="post-card">
                    <img src={post.imageUrl} alt={post.title} className="post-image" />
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                </div>
            ))}

            <hr />

            <h2>Bài viết theo loại</h2>

            {topics.map(topic => (
                <div key={topic.id} className="topic-section">
                    <h3>{topic.name}</h3>
                    <div className="topic-posts">
                        {renderPostsByTopic(topic.id).length > 0 ? (
                            renderPostsByTopic(topic.id)
                        ) : (
                            <p>Chưa có bài viết nào trong chủ đề này.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllPost;
