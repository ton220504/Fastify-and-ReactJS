const getAllCategorySchema = require("./category.getall.schema");
const getOneCategorySchema = require("./category.getone.schema");
const createCategorySchema = require("./category.create.schema");
const updateCategorySchema = require("./category.update.schema");
const deleteCategorySchema = require("./category.delete.schema");
const restoreCategorySchema = require("./category.restore.schema");
module.exports = {
    getAllCategorySchema,
    getOneCategorySchema,
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
    restoreCategorySchema
}