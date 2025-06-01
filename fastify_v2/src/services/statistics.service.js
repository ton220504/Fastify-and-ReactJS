const countUser = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_users FROM users`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_users);
        });
    });
};
const countProduct = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_products FROM product WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_products);
        });
    });
};
const countbrand = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_brands FROM brand WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_brands);
        });
    });
};
const countcategory = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_categories FROM category WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_categories);
        });
    });
};
const counttopic = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_topics FROM topic WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_topics);
        });
    });
};
const countpost = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_posts FROM post WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_posts);
        });
    });
};
const countbanner = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_banners FROM banner WHERE isDelete = 0`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_banners);
        });
    });
};
const countreview = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_reviews FROM reviews`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_reviews);
        });
    });
};
const countpostcomment = async (db) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_postcomments FROM postcomment`, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total_postcomments);
        });
    });
};
module.exports = {
    countUser,
    countProduct,
    countbrand,
    countcategory,
    counttopic,
    countpost,
    countbanner,
    countreview,
    countpostcomment
}