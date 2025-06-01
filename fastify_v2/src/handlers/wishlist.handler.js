const WishlistService = require('../services/wishlist.service');

const create = async (req, reply) => {
  try {
    const { user_id, product_id } = req.body;
    const result = await WishlistService.createWishlist(req.server.mysql, user_id, product_id);
    reply.code(201).send(result);
  } catch (err) {
    reply.code(500).send({ error: 'Server error', message: err.message });
  }
};

const getAll = async (req, reply) => {
  try {
    const result = await WishlistService.getAllWishlists(req.server.mysql);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: 'Server error', message: err.message });
  }
};

const getOne = async (req, reply) => {
  try {
    const { user_id } = req.params;
    const result = await WishlistService.getWishlistByUser(req.server.mysql, user_id);
    if (!result) return reply.code(404).send({ message: 'Wishlist not found' });
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: 'Server error', message: err.message });
  }
};

const remove = async (req, reply) => {
  try {
    const { wishlist_item_id } = req.params;
    const result = await WishlistService.removeWishlistItem(req.server.mysql, wishlist_item_id);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: 'Server error', message: err.message });
  }
};
async function countUserWishlistHandler(req, res) {
  const { user_id } = req.params;
  try {
    const result = await WishlistService.countWishlistByUserId(this.mysql, user_id);
    res.send(result); // Trả về { count: x }
  } catch (err) {
    console.error("Lỗi khi đếm wishlist:", err);
    res.status(500).send({ error: err.message });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  remove,
  countUserWishlistHandler
};
