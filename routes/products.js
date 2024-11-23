const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const PRODUCTS_FILE = './data/productos.json';

const readProducts = () => JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8') || '[]');
const writeProducts = (data) => fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));

// ================================================ OBTENEMOS PRODUCTOS CON LIMIT ================================================ 
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = parseInt(req.query.limit);
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// ================================================ OBTENEMOS PRODUCTOS POR ID ================================================  
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// ================================================ CREAMOS UN NUEVO PRODUCTO ================================================  
router.post('/', (req, res) => {
    const products = readProducts();
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'All fields except thumbnails are required' });
    }

    const newProduct = {
        id: uuidv4(), // Alphanumeric unique ID
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// ================================================ EDITAMOS UN PRODUCTO CON LA FUNCION PUT Y EL ID DEL PRODUCTO A EDITAR ================================================  
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);

    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

    const updatedFields = req.body;

    if (updatedFields.id) {
        return res.status(400).json({ error: "ID can't be updated" });
    }

    products[productIndex] = {
        ...products[productIndex],
        ...updatedFields,
    };

    writeProducts(products);
    res.json(products[productIndex]);
});

// ================================================  ELIMINAMOS UN PRODUCTO CON LA FUNCION DELETE UTILIZANDO EL ID ================================================  
router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);

    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

    const deletedProduct = products.splice(productIndex, 1);
    writeProducts(products);
    res.json(deletedProduct);
});

module.exports = router;
