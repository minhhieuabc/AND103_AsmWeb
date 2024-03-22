var express = require('express');
var router = express.Router();

// Thêm model
const Products = require('../models/products');
const Upload = require('../config/common/upload');

router.post('/add-product', Upload.single('image'), async (req, res) => {
    try {
        const data = req.body;
        const {file} = req;
        const urlImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
        const newProducts = new Products({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            image: urlImage       
        });

        const result = await newProducts.save();
        if(result){
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            });
        } else{
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm thất bại",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/get-product-byId/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const data = await Products.findById(id).populate('id_product');
        res.json({
            "status": 200,
            "messenger": "Lấy dữ liệu thành công",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/get-list-product', async (req, res) => {
    try {
        const data = await Products.find().sort({createdAt: -1});

        if(data){
            res.json({
                "status": 200,
                "messenger": "Lấy dữ liệu thành công",
                "data": data
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lấy dữ liệu thất bại",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.put('/update-product/:id', Upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { file } = req;

        // Tìm category cần sửa trong cơ sở dữ liệu
        const productToUpdate = await Products.findById(id);
        // Nếu có ảnh mới được tải lên, xóa ảnh cũ trước khi cập nhật
        /*if (file) {
            const oldImagePath = productToUpdate.image;
            if (oldImagePath) {
                // Xóa ảnh cũ từ hệ thống lưu trữ
                const fs = require('fs');
                fs.unlinkSync(oldImagePath);
                // Cập nhật đường dẫn ảnh mới trong cơ sở dữ liệu
                productToUpdate.image = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
            }
        }*/
        

        if (!productToUpdate) {
            res.json({
                "status": 400,
                "messenger": "Không tìm thấy để cập nhật"
            });
        }

        // Cập nhật thông tin product
        productToUpdate.name = data.name || productToUpdate.name,
        productToUpdate.quantity = data.quantity || productToUpdate.quantity,
        productToUpdate.price = data.price || productToUpdate.price
        if (file) {
            productToUpdate.image = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
        }

        // Lưu productt đã cập nhật vào cơ sở dữ liệu
        const updatedProduct = await productToUpdate.save();

        res.json({
            status: 200,
            message: "Cập nhật thành công",
            data: updatedProduct
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/update-product-without-thumbnail/:id_product', async (req, res) => {
    const id_product = req.params.id_product;
    const newData = req.body;

    const updatedFields = {
        name: newData.name,
        quantity: newData.quantity,
        price: newData.price,
    };

    try {
        const updatedProduct = await Products.findByIdAndUpdate(id_product, updatedFields, { new: true });

        if (updatedProduct) {
            res.json({
                status: 200,
                message: "Cập nhật sản phẩm thành công!",
                data: updatedProduct,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Không tìm thấy sản phẩm để cập nhật!",
                data: null,
            });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
});

router.delete('/delete-product-byId/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteProduct = await Products.findByIdAndDelete(id).populate('id_product');
        if(deleteProduct){
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": deleteProduct
            });
        } else{
            res.json({
                "status": 400,
                "messenger": "Xóa thất bại",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;