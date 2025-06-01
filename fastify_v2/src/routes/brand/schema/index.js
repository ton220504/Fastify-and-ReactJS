const getAllBrandSchema = require("./brand.getall.schema");
const getOneBrandSchema = require("./brand.getone.schema");
const createBrandSchema = require("./brand.create.schema");
const updateBrandSchema = require("./brand.update.schema");
const deleteBrandSchema = require("./brand.delete.schema");
const restoreBrandSchema = require("./brand.restore.schema");
module.exports = {
    getAllBrandSchema,
    getOneBrandSchema,
    createBrandSchema,
    updateBrandSchema,
    deleteBrandSchema,
    restoreBrandSchema
}