const postService = require("../services/post.service");

async function getAll(req, res) {
    try {
        const posts = await postService.getAllPosts(req.server.mysql);
        res.send(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getAllPostComment(req, res) {
    try {
        const posts = await postService.getAllComment(req.server.mysql);
        res.send(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getAllIsDelete(req, res) {
    try {
        const posts = await postService.getAllPostsIsdelete(req.server.mysql);
        res.send(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getOne(req, res) {
    try {
        const { id } = req.params;
        const post = await postService.getOnePost(req.server.mysql, id);

        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        res.send(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function create(req, res) {
    try {
        const postData = req.body;
        const newPost = await postService.createPost(req.server.mysql, postData);
        res.status(201).send(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const postData = req.body;

        const result = await postService.updatePost(req.server.mysql, id, postData);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.send({ message: "Post updated successfully" });
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;

        const result = await postService.deletePost(req.server.mysql, id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.send({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function removePostComment(req, res) {
    try {
        const { id } = req.params;

        const result = await postService.deletePostComment(req.server.mysql, id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.send({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
const getPostsByTopic = async (req, res) => {
    try {
        const { topic_id } = req.params;

        if (!topic_id || isNaN(topic_id)) {
            return res.status(400).send({ error: "topic_id không hợp lệ" });
        }

        const posts = await postService.getPostsByTopicId(req.server.mysql, topic_id);
        res.status(200).send(posts);
    } catch (error) {
        console.error("Lỗi khi lấy bài viết theo topic_id:", error);
        res.status(500).send({ error: "Đã xảy ra lỗi server" });
    }
};
const createComment = async (req, reply) => {
    try {
        const review = await postService.createPostComment(req.server.mysql, req.body);
        reply.code(201).send(review);
    } catch (err) {
        reply.code(500).send({ error: 'Internal Server Error', details: err.message });
    }
};
const getCommentsByUserAndPost = async (req, res) => {
    const { user_id, post_id } = req.params;

    if (!user_id || !post_id) {
        return res.status(400).send({ error: "Thiếu user_id hoặc post_id" });
    }

    try {
        const comments = await postService.getCommentByUserIdAndPostId(req.server.mysql, user_id, post_id);
        res.status(200).send(comments);
    } catch (error) {
        console.error("Lỗi khi lấy comment:", error);
        res.status(500).send({ error: "Lỗi server" });
    }
};
const getCommentByPostId = async (req, res) => {
    const { post_id } = req.params;
    const db = req.server.mysql;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).send({ error: "post_id không hợp lệ" });
    }

    try {
        const comments = await postService.getCommentByPostId(db, post_id);
        res.status(200).send(comments);
    } catch (error) {
        console.error("Lỗi lấy bình luận theo post_id:", error);
        res.status(500).send({ error: "Lỗi server" });
    }
};
async function IsDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid post ID' });
    }

    const result = await postService.softDelete(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'post not found or already deleted' });
    }

    res.send({ message: 'post soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid post ID' });
    }

    const result = await postService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'post not found or already deleted' });
    }

    res.send({ message: 'post soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    getPostsByTopic,
    createComment,
    getCommentsByUserAndPost,
    getCommentByPostId,
    getAllIsDelete,
    IsDelete,
    restore,
    getAllPostComment,
    removePostComment
};
