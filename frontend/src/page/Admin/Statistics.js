import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';


const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  //////////
  const [user, setUser] = useState(0);
  const [product, setProduct] = useState(0);
  const [brand, setbrand] = useState(0);
  const [category, setCategory] = useState(0);
  const [topic, setTopic] = useState(0);
  const [post, setPost] = useState(0);
  const [banner, setBanner] = useState(0);
  const [review, setReview] = useState(0);
  const [postcomment, setPostComment] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState([]);

  // Lấy thông tin sản phẩm chi tiết
  const fetchProductName = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      return response.data.name;  // trả về tên sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      return "Sản phẩm không tồn tại";  // trả về tên mặc định nếu có lỗi
    }
  };
  const translateOrderStatus = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      PAID: "Chờ giao hàng",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELED: "Đã hủy",
      FAILED: "Thất bại"
    };
    return statusMap[status] || status;
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/orders");
        const orders = response.data;
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
          name: `Tháng ${i + 1}`,
          totalRevenue: 0,
        }));

        const monthlyQuantity = Array.from({ length: 12 }, (_, i) => ({
          name: `Tháng ${i + 1}`,
          totalQuantity: 0,
        }));

        // Duyệt qua các đơn hàng để tính doanh thu và số lượng bán
        const productMap = {};

        orders.forEach(order => {
          const month = new Date(order.created_at).getMonth();

          monthlyRevenue[month].totalRevenue += order.total_price ?? 0;

          if (Array.isArray(order.items)) {
            order.items.forEach(item => {
              monthlyQuantity[month].totalQuantity += item.quantity ?? 0;

              const productId = item.product_id; // ID sản phẩm
              const quantity = item.quantity;

              if (!productMap[productId]) {
                productMap[productId] = {
                  productId,
                  totalSold: 0,
                };
              }

              productMap[productId].totalSold += quantity;
            });
          }
        });

        // Lấy tên sản phẩm và cập nhật danh sách top 5 sản phẩm bán chạy
        const topProductList = await Promise.all(
          Object.values(productMap)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5)
            .map(async (product) => {
              const productName = await fetchProductName(product.productId);
              return { ...product, name: productName };
            })
        );
        // Tính số lượng đơn hàng theo từng trạng thái
        const statusMap = {};

        orders.forEach(order => {
          const status = order.status;
          if (!statusMap[status]) {
            statusMap[status] = 0;
          }
          statusMap[status]++;
        });

        // Biến đổi thành mảng cho Pie chart
        const statusData = Object.entries(statusMap).map(([status, value]) => ({
          name: translateOrderStatus(status),
          value,
        }));

        setOrderStatusData(statusData);
        setTopProducts(topProductList);
        setChartData(monthlyRevenue);
        setQuantityData(monthlyQuantity);
      } catch (error) {
        console.error("Lỗi khi fetch đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const maxRevenue = Math.max(...chartData.map(item => item.totalRevenue), 0);
  const yAxisMax = Math.ceil(maxRevenue / 10000000) * 10000000 + 10000000;
  ////////////////
  const Action = [
    { name: "Người dùng", url: "/admin/user", count: user, color: "#ee4444" },
    { name: "Sản phẩm", url: "/admin/product", count: product, color: "green" },
    { name: "Thương hiệu", url: "/admin/brand", count: brand, color: "gold" },
    { name: "Danh mục", url: "/admin/categories", count: category, color: "#00ccff" },
    { name: "Topic", url: "/admin/topic", count: topic, color: "#ee4444" },
    { name: "Bài viết", url: "/admin/post", count: post, color: "gold" },
    { name: "Banner", url: "/admin/banner", count: banner, color: "#00ccff" },
    { name: "Đánh giá sản phẩm", url: "/admin/review", count: review, color: "#ee4444" },
    { name: "Bình luận bài viết", url: "/admin/postcomment", count: postcomment, color: "green" },
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userRes,
          productRes,
          brandRes,
          categoryRes,
          topicRes,
          postRes,
          bannerRes,
          reviewRes,
          commentRes
        ] = await Promise.all([
          axios.get('http://127.0.0.1:3000/api/count/user'),
          axios.get('http://127.0.0.1:3000/api/count/product'),
          axios.get('http://127.0.0.1:3000/api/count/brand'),
          axios.get('http://127.0.0.1:3000/api/count/category'),
          axios.get('http://127.0.0.1:3000/api/count/topic'),
          axios.get('http://127.0.0.1:3000/api/count/post'),
          axios.get('http://127.0.0.1:3000/api/count/banner'),
          axios.get('http://127.0.0.1:3000/api/count/review'),
          axios.get('http://127.0.0.1:3000/api/count/postcomment')
        ]);

        setUser(userRes.data.total_users);
        setProduct(productRes.data.total_products);
        setbrand(brandRes.data.total_brands);
        setCategory(categoryRes.data.total_categories);
        setTopic(topicRes.data.total_topics);
        setPost(postRes.data.total_posts);
        setBanner(bannerRes.data.total_banners);
        setReview(reviewRes.data.total_reviews);
        setPostComment(commentRes.data.total_postcomments);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    fetchData();
  }, []);
  

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <>
      <div className='form-control' style={{ height: "400px" }}>
        <p style={{ fontWeight: "bold" }}>Dữ liệu cửa hàng</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {Action.map((ac, index) => (
            <div key={index} className='form-control' style={{ width: "18%", height: "150px", backgroundColor: ac.color }}>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>{ac.name}</p>
              <p style={{ color: "white", fontWeight: "bold" }}>Số lượng: {ac.count}</p>
              <Link style={{ fontStyle: "italic" }} to={ac.url}>Xem chi tiết</Link>
            </div>
          ))}
        </div>

      </div>
      {/* Biểu đồ doanh thu */}
      <div className='form-control mt-2'>
        <p style={{ display: "flex", justifyContent: "center", marginTop: "20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Doanh thu cả năm</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[0, yAxisMax]}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Legend />
            <Bar dataKey="totalRevenue" barSize={30} fill="#413ea0" name="Tổng doanh thu" />
            <Line type="monotone" dataKey="totalRevenue" stroke="#ff7300" name="Xu hướng" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/*Biểu đồ số lượng bán theo tháng */}
      <div className='form-control mt-2'>
        <p style={{ display: "flex", justifyContent: "center", marginTop: "20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Số lượng bán theo từng tháng</p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={quantityData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="totalQuantity"
              stroke="#8884d8"
              fill="#8884d8"
              name='Số lượng'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/*top 5 sản phẩm bán chạy */}
      <div className='row mt-2'>
        <div className='col-6'>
          <p style={{ display: "flex", justifyContent: "center", marginTop: "20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Top 5 sản phẩm bán chạy</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis tick={false} dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} />
              <YAxis type="number" />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#008080" name="Số lượng bán" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='col-6'>
          <p style={{ display: "flex", justifyContent: "center", marginTop: "20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Trạng thái đơn hàng</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
};

export default RevenueChart;

