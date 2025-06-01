const OrderService = require('../services/order.service');

async function createOrder(req, reply) {
  try {
    console.log("BODY NHẬN VỀ:", req.body); // 👈 Xem thử body có đúng không
    const order = await OrderService.createOrder(req.server.mysql, req.body);
    reply.code(201).send(order);
  } catch (err) {
    console.error('Error in createOrder:', err);
    reply.code(500).send({
      error: 'Internal Server Error',
      details: err.message
    });
  }
}


const getAllOrders = async (req, reply) => {
  try {
    const orders = await OrderService.getAllOrders(req.server.mysql);
    reply.code(200).send(orders); // Trả về mã trạng thái 200 mặc định cho thành công
  } catch (err) {
    reply.code(500).send({ error: "Internal Server Error", details: err.message });
  }
};


const getOrdersByUserId = async (req, reply) => {
  const { user_id } = req.params;

  // Kiểm tra nếu user_id không hợp lệ
  if (!user_id) {
    return reply.code(400).send({ error: "Bad Request", message: "User ID is required." });
  }

  console.log("Received user_id:", user_id); // In giá trị của user_id

  try {
    const orders = await OrderService.getOrdersByUserId(req.server.mysql, user_id);

    console.log("Orders retrieved:", orders); // In kết quả trả về từ hàm Service

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!orders || orders.length === 0) {
      return reply.code(404).send({ error: "Not Found", message: "No orders found for this user." });
    }

    reply.code(200).send(orders);
  } catch (err) {
    console.error("Error fetching orders:", err); // In lỗi nếu có
    reply.code(500).send({ error: "Internal Server Error", details: err.message });
  }
};



const deleteOrder = async (req, reply) => {
  try {
    const result = await OrderService.deleteOrder(req.server.mysql, req.params.id);
    reply.send(result);
  } catch (err) {
    reply.code(500).send({ error: "Internal Server Error", details: err.message });
  }
};
const handleGetOrderById = async (req, reply) => {
  const { id } = req.params;
  const db = req.server.mysql;

  try {
    const order = await OrderService.getOrderById(db, id);
    if (!order) {
      return reply.code(404).send({ message: "Đơn hàng không tồn tại." });
    }
    reply.send(order);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo ID:", error);
    reply.code(500).send({ message: "Lỗi server" });
  }
};

const handleUpdateOrderStatus = async (req, reply) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = req.server.mysql;

  try {
    await OrderService.updateOrderStatus(db, id, status);
    reply.send({ message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    reply.code(500).send({ message: "Cập nhật trạng thái thất bại." });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  deleteOrder,
  handleGetOrderById,
  handleUpdateOrderStatus
};