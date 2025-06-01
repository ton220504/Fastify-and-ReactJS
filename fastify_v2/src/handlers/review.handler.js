// handlers/ReviewHandler.js
const ReviewService = require('../services/reviewService');

const createReview = async (req, reply) => {
  try {
    const review = await ReviewService.createReview(req.server.mysql, req.body);
    reply.code(201).send(review);
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
};

const deleteReview = async (req, reply) => {
  try {
    const result = await ReviewService.deleteReview(req.server.mysql, req.params.id);
    reply.send(result);
  } catch (err) {
    reply.code(404).send({ error: 'Not Found', message: err.message });
  }
};

const getAllReviews = async (req, reply) => {
  try {
    const reviews = await ReviewService.getAllReviews(req.server.mysql);
    reply.send(reviews);
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
};

const getReviewsByUserId = async (req, reply) => {
  try {
    const reviews = await ReviewService.getReviewsByUserId(req.server.mysql, req.params.user_id);
    reply.send(reviews);
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
};
const getReviewsByProductIdHandler = async (req, reply) => {
  try {
    const reviews = await ReviewService.getReviewsByProductId(req.server.mysql, req.params.product_id);

    // Chuyển đổi từng review để gộp user info
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      content: review.content,
      product_id: review.product_id,
      user_id: review.user_id,
      created_at: review.created_at,
      user: {
        username: review.username,
        email: review.email,
      },
    }));

    reply.status(200).send(formattedReviews);
  } catch (error) {
    console.error("❌ Lỗi handler:", error);
    reply.status(500).send({ error: "Lỗi server khi lấy đánh giá theo sản phẩm." });
  }
};
const updateReview = async (req, reply) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updated = await ReviewService.updateReview(req.server.mysql, id, { content });
    reply.code(200).send(updated);
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
};
const getOneReview = async (req, reply) => {
  try {
    const { id } = req.params;
    const review = await ReviewService.getOneReview(req.server.mysql, id);

    if (!review) {
      return reply.code(404).send({ error: "Review không tồn tại!" });
    }

    reply.code(200).send(review);
  } catch (err) {
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
};
const getReviewsByProductNameHandler = async (req, reply) => {
  try {
    const reviews = await ReviewService.getReviewsByProductName(req.server.mysql, req.query.name);
    console.log("✅ Kết quả SQL:", reviews);
    const formatted = reviews.map(r => ({
      id: r.id,
      content: r.content,
      product_id: r.product_id,
      user_id: r.user_id,
      created_at: r.created_at,
      name: r.name,
      user: {
        username: r.username,
        email: r.email,
      },
      product: {
        name:  r.name, // Nếu bạn SELECT p.name AS product_name
      },
    }));

    reply.status(200).send(formatted);
  } catch (err) {
    console.error("❌ Lỗi handler tìm theo tên sản phẩm:", err);
    reply.status(500).send({ error: "Lỗi server khi tìm review theo tên sản phẩm." });
  }
};


module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByUserId,
  getReviewsByProductIdHandler,
  updateReview,
  getOneReview,
  getReviewsByProductNameHandler
};
