const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

const app = express();
const PORT = 8080;

//================================================ Middleware ================================================ 
app.use(bodyParser.json());

// ================================================  Routes  ================================================ 
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server esta corriendo en http://localhost:${PORT}`);
});
