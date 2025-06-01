const getAllPosts = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM post WHERE isDelete = 0", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getAllComment = async (db) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                c.*, 
                JSON_OBJECT('id', u.id, 'username', u.username, 'email', u.email) AS user,
                JSON_OBJECT(
                    'id', p.id, 'title', p.title, 'slug', p.slug,
                    'description', p.description, 'detail', p.detail,
                    'image', p.image, 'topic_id', p.topic_id,
                    'status', p.status, 'created_by', p.created_by,
                    'created_at', p.created_at
                ) AS post
            FROM postcomment c
            JOIN users u ON c.user_id = u.id
            JOIN post p ON c.post_id = p.id
        `;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            // Chuyển chuỗi JSON thành object
            const parsedResults = results.map(row => ({
                ...row,
                user: JSON.parse(row.user),
                post: JSON.parse(row.post),
            }));
            resolve(parsedResults);
        });
    });
};

const getAllPostsIsdelete = async (db) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM post WHERE isDelete = 1", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getOnePost = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM post WHERE id = ?", [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};

const createPost = async (db, post) => {
    const { title, slug, description, detail, image, topic_id, status, created_by } = post;

    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO post (title, slug, description, detail, image, topic_id, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
            [title, slug, description, detail, image, topic_id, status, created_by],
            (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, ...post });
            }
        );
    });
};

const updatePost = async (db, id, post) => {
    const { title, slug, description, detail, image, topic_id, status } = post;

    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE post SET title = ?, slug = ?, description = ?, detail = ?, image = ?, topic_id = ?, status = ? WHERE id = ?",
            [title, slug, description, detail, image, topic_id, status, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const deletePost = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM post WHERE id = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
const deletePostComment = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM postcomment WHERE id = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
const getPostsByTopicId = (db, topicId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM post WHERE topic_id = ?", [topicId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const createPostComment = async (db, { content, post_id, user_id }) => {
    return new Promise((resolve, reject) => {
        const created_at = new Date();
        db.query(
            `INSERT INTO postComment (content, post_id, user_id, created_at) VALUES (?, ?, ?, ?)`,
            [content, post_id, user_id, created_at],
            (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, content, post_id, user_id, created_at });
            }
        );
    });
};
const getCommentByUserIdAndPostId = async (db, userId, postId) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
          pc.*, 
          u.username AS user_name, 
          u.email AS user_email
        FROM postComment pc
        JOIN users u ON pc.user_id = u.id
        WHERE pc.user_id = ? AND pc.post_id = ?
        ORDER BY pc.created_at DESC
      `;

        db.query(sql, [userId, postId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const getCommentByPostId = async (db, postId) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
          pc.*, 
          u.username AS user_name, 
          u.email AS user_email
        FROM postComment pc
        JOIN users u ON pc.user_id = u.id
        WHERE pc.post_id = ?
        ORDER BY pc.created_at DESC
      `;

        db.query(sql, [postId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const softDelete = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE post SET isDelete = 1 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Soft Delete Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};
const restore = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE post SET isDelete = 0 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL Soft Delete Error:", err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};



module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    deletePost,
    getPostsByTopicId,
    createPostComment,
    getCommentByUserIdAndPostId,
    getCommentByPostId,
    getAllPostsIsdelete,
    softDelete,
    restore,
    getAllComment,
    deletePostComment
};
