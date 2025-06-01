const getAllProductSchema = require("./product.getall.schema");
const getAllProductIsDeleteSchema = require("./product.getallisdelete.schema");
const getOneProductSchema = require("./product.getone.schema");
const createProductSchema = require("./product.create.schema");
const updateProductSchema = require("./product.update.schema");
const deleteProductSchema = require("./product.delete.schema");
const searchSchema  = require("./product.search.schema");
const getBrandName = require("./product.getBrandName.schema");
const getCategoryName = require("./product.getCategoryName.schema");
const getNewest = require("./product.newest.schema");
const updateStockSchema = require("./product.updateStock.schema");
const restoreProductSchema = require("./product.restore.schema");
const getNameProductSchema = require("./product.getnameproduct.schema");


module.exports = {
    getAllProductSchema,
    getOneProductSchema,
    createProductSchema,
    updateProductSchema,
    deleteProductSchema,
    searchSchema,
    getBrandName,
    getCategoryName,
    getNewest,
    updateStockSchema,
    getAllProductIsDeleteSchema,
    restoreProductSchema,
    getNameProductSchema
    
}