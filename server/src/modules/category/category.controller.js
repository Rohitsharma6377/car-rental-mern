import { createCategorySchema , updateCategorySchema } from "./category.validator.js";
import CategoryServices from "./category.services.js";


export const createCategory = async (req, res, next) => {
    try {
        const { error } = createCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const data = {
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.path : null
        };

        const result = await CategoryServices.createCategory(data);
        res.status(201).json({ message: "Category created successfully", result });
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = updateCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const data = {
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.path : req.body.image,
            is_active: req.body.is_active
        };

        const result = await CategoryServices.updateCategory(id, data);
        res.json({ message: "Category updated successfully", result });
    } catch (err) {
        next(err);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryServices.getAllcategories();
        if (categories.length === 0) {
            return res.status(404).json({ message: "no categories found" });
        }
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await CategoryServices.getCategoryById(id);
        res.json(category);
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await CategoryServices.deleteCategory(id);
        res.json({ message: "Category deleted successfully", result });
    } catch (err) {
        next(err);
    }
};

export default {
    createCategory,
    updateCategory,
    getCategories,
    getCategory,
    deleteCategory
};