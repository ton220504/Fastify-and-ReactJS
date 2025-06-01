import AdminPage from "../page/Admin/admin";
import Order from "../page/Admin/Cart/Orders";
import Cart from "../page/Admin/Cart/Cart";
import Wishlist from "../page/Admin/Cart/Wishlist";
import Brand from "../page/Admin/Brand/Brand";
import Category from "../page/Admin/Category/Category";

import Products from "../page/Admin/Product/Product";
import ProductCreate from "../page/Admin/Product/ProductCreate";
import ProductEdit from "../page/Admin/Product/ProductEdit";
import User from "../page/Admin/User/User";
import Statistics from "../page/Admin/Statistics";
import CreateUser from "../page/Admin/User/CreateUser";
import Topic from "../page/Admin/Topic/Topic";
import Post from "../page/Admin/post/post";
import Banner from "../page/Admin/Banner/Banner";
import Review from "../page/Admin/Product/Review";
import TrashCan from "../page/Admin/Product/trashCan";
import BrandTrashCan from "../page/Admin/Brand/BrandTrashCan";
import CategoryTrashCan from "../page/Admin/Category/CategoryTrashCan";
import BannerTrashCan from "../page/Admin/Banner/BannerTrashCan";
import TopicTrashCan from "../page/Admin/Topic/TopicTrashCan";
import PostTrashCan from "../page/Admin/post/PostTrashCan";
import PostComment from "../page/Admin/post/PostComment";

const BERouter = [
    //{ path: "/admin/user", components: <TableUsers /> },
    //{ path: "/admin/login", components: <LoginAdmin /> },
    { path: "/admin", components: <AdminPage /> },
    { path: "product", components: <Products /> },
    { path: "brand", components: <Brand /> },
    { path: "categories", components: <Category /> },
    { path: "productCreate", components: <ProductCreate /> },
    { path: "ProductEdit/:id", components: <ProductEdit /> },
    { path: "user", components: <User /> },
    { path: "cart", components: <Cart /> },
    { path: "abate", components: <Order /> },
    { path: "wishlist", components: <Wishlist /> },
    { path: "Statistics", components: <Statistics /> },
    { path: "UsersCreate", components: <CreateUser /> },
    { path: "topic", components: <Topic /> },
    { path: "post", components: <Post /> },
    { path: "banner", components: <Banner /> },
    { path: "review", components: <Review /> },
    { path: "trashcan", components: <TrashCan /> },
    { path: "brandtrashcan", components: <BrandTrashCan /> },
    { path: "categorytrashcan", components: <CategoryTrashCan /> },
    { path: "bannertrashcan", components: <BannerTrashCan /> },
    { path: "topictrashcan", components: <TopicTrashCan /> },
    { path: "posttrashcan", components: <PostTrashCan /> },
    { path: "postcomment", components: <PostComment /> },




]
export default BERouter;