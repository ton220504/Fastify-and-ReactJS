const CartService = require('../services/cart.service');

const create = async (req, reply) => {
  try {
    const result = await CartService.createCart(req.server.mysql, req.body);
    reply.code(201).send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};



const updateQuantity = async (req, reply) => {
  try {
    const result = await CartService.updateQuantity(req.server.mysql, req.body);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

const remove = async (req, reply) => {
  try {
    const result = await CartService.deleteCart(req.server.mysql, req.params.id);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

const getAll = async (req, reply) => {
  try {
    const result = await CartService.getAllCarts(req.server.mysql);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

const getByUser = async (req, reply) => {
  try {
    const result = await CartService.getCartByUserId(req.server.mysql, req.params.user_id);
    if (!result) return reply.code(404).send({ error: 'Cart not found' });
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};
async function countCartItemsHandler(req, res) {
  const { user_id } = req.params;
  try {
    const result = await CartService.countCartItemsByUserId(this.mysql, user_id);
    res.send(result); // Trả về { count: x }
  } catch (err) {
    console.error("Lỗi khi đếm wishlist:", err);
    res.status(500).send({ error: err.message });
  }
}
const removecart = async (req, reply) => {
  try {
    const { cart_item_id } = req.params;
    const result = await CartService.removeCart(req.server.mysql, cart_item_id);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: 'Server error', message: err.message });
  }
};
module.exports = {
  create,
  updateQuantity,
  remove,
  getAll,
  getByUser,
  countCartItemsHandler,
  removecart
};
