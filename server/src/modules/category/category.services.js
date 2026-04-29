import { pool } from "../../config/db.js";


class CategoryServices {
    static async ensureTable(){
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories(
        id INT AUTO_INCREMENT PRIMARY KEY ,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    }
    static async createCategory(data){
        const {name , description , image} = data;

        if(!name || !description || !image ){
            throw new Error("all Fields are required")
        }
        const [existing] = await pool.query("SELECT id FROM categories WHERE name = ?", [name]);
        if(existing.length > 0){
            throw new Error( " category already exists ")
        }
        const [rows] = await pool.query("INSERT INTO categories (name, description, image , is_active) VALUES (?,?,?,?)", [name , description , image, true]);
        return rows;
        
    }

    static async getAllcategories(){
        const [rows] = await pool.query("SELECT * FROM categories ORDER BY created_at DESC");

        return rows;
    }
    static async getCategoryById(id){
        const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);

        if(rows.length === 0 ){
            throw new Error("category not found")
        }
        return rows[0];
    }

    static async updateCategory(id, data){
        const {name , description , image , is_active} = data;

        const [rows] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);

        if(rows.length === 0){
            throw new Error("category not found")
        }

        const [result] = await pool.query("UPDATE categories SET name = ? , description = ? , image = ? , is_active =? WHERE id = ?", [name , description , image , is_active , id]);

        return result;
    };

    static async deleteCategory(id){
        const [rows] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);

        if(rows.length === 0){
            throw new Error("category not Found")
        }

        const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
        return result;
    }
}

export default CategoryServices;