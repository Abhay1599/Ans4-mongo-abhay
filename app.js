// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Types: { ObjectId } } = require('mongoose');
// Import database configuration
const database = require('./config/database');
const exphbs = require("express-handlebars");
var path = require("path");


// Set up express app
const app = express();
const port = process.env.PORT || 3002;

// Connect to MongoDB
mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));



// Configuiring handlebars as the template engine to be used with custom helpers according to questions
app.engine(".hbs",exphbs.engine({extname: ".hbs"}));

// Setting Handlebars (hbs) as the view engine for rendering dynamic content.
app.set("view engine", "hbs");

// Set the views directory for both engines
app.set("views", path.join(__dirname, "views"));



// Import Product model
const Product = require('./models/product');

// Middleware to parse incoming request body
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Validations
// Middleware to validate ObjectId format
const validateProductId = (req, res, next) => {
  const productId = req.params.product_id;
  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }
  next(); // Move to the next middleware
};

// Use Handlebars to get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().limit(500).lean().exec();
    res.render('product', { data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Use Handlebars to insert  new product

// Route to open the form for adding a new product
app.get('/products/new', (req, res) => {
  res.render('insert_product');
});

app.post('/create-product', async (req, res) => {
  try {
    // Retrieve product details from the request body
    const { asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, isBestSeller, boughtInLastMonth } = req.body;
    
    // Create a new product object
    const newProduct = await Product.create({ asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, isBestSeller, boughtInLastMonth });

    // Send JSON response indicating success
    res.json({ success: true, message: 'Product added successfully!' });
  } catch (err) {
    console.error('Error adding product:', err);
    // Send JSON response indicating failure
    res.status(500).json({ success: false, message: 'Error adding product: ' + err.message });
  }
});


// Define routes

// Show all product info

/*Using promises*/
// app.get('/api/products', (req, res) => {
//   Product.find().limit(500)
//     .then(products => {
//       res.json(products);
//     })
//     .catch(err => {
//       console.error('Error fetching products:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });


/*Using async/await syntax*/
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().limit(500);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Show a specific product by _id

/*Using promises*/
// app.get('/api/products/:product_id', validateProductId, (req, res) => {
//   Product.findById(req.params.product_id)
//     .then(product => {
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//       res.json(product);
//     })
//     .catch(err => {
//       console.error('Error fetching product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });

/*Using async/await syntax*/
app.get('/api/products/:product_id', validateProductId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Show a specific product by asin

/*Using promises*/
// app.get('/api/products/asins/:asin', (req, res) => {
//   Product.findOne({ asin: req.params.asin })
//     .then(product => {
//       if (!product) {
//         res.status(404).json({ error: 'Product not found' });
//       } else {
//         res.json(product);
//       }
//     })
//     .catch(err => {
//       console.error('Error fetching product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });

/*Using async/await syntax*/
app.get('/api/products/asins/:asin', async (req, res) => {
  try {
    const product = await Product.findOne({ asin: req.params.asin });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Insert a new product
/*Using promises*/
// app.post('/api/products', (req, res) => {
//   const { asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, boughtInLastMonth } = req.body;
//   Product.create({ asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, boughtInLastMonth })
//     .then(product => {
//       res.status(201).json(product);
//     })
//     .catch(err => {
//       console.error('Error creating product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });

/*Using async/await syntax*/
app.post('/api/products', async (req, res) => {
  try {
    const { asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, boughtInLastMonth } = req.body;
    const product = await Product.create({ asin, title, imgUrl, stars, reviews, price, listPrice, categoryName, boughtInLastMonth });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Update a product using product id
/*Using promises*/
// app.put('/api/products/:product_id', validateProductId, (req, res) => {
//   const productId = req.params.product_id;
//   const { title, price } = req.body;

//   // Check if the provided product ID is a valid ObjectId
//   if (!ObjectId.isValid(productId)) {
//     return res.status(400).json({ error: 'Invalid product ID' });
//   }

//   // Find the product by _id
//   Product.findById(productId)
//     .then(product => {
//       // If the product with the provided _id is not found, return a 404 error
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }

//       // Update the title and price fields
//       product.title = title;
//       product.price = price;

//       // Save the updated product
//       return product.save();
//     })
//     .then(updatedProduct => {
//       // Send a success response
//       res.json({ message: 'Product updated successfully', product: updatedProduct });
//     })
//     .catch(err => {
//       console.error('Error updating product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });




/*Using async/await syntax*/
app.put('/api/products/:product_id', validateProductId, async (req, res) => {
  try {
    const productId = req.params.product_id;
    const { title, price } = req.body;

    // Check if the provided product ID is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find the product by _id
    const product = await Product.findById(productId);

    // If the product with the provided _id is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the title and price fields
    product.title = title;
    product.price = price;

    // Save the updated product
    await product.save();

    // Send a success response
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





//Update a producting using asin
/*Using promises*/
// app.put('/api/products/asins/:asin', (req, res) => {
//   const asin = req.params.asin;
//   const { title, price } = req.body;

//   // Find the product by asin
//   Product.findOne({ asin })
//     .then(product => {
//       // If the product with the provided asin is not found, return a 404 error
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }

//       // Update the title and price fields
//       product.title = title;
//       product.price = price;

//       // Save the updated product
//       return product.save();
//     })
//     .then(updatedProduct => {
//       // Send a success response
//       res.json({ message: 'Product updated successfully', product: updatedProduct });
//     })
//     .catch(err => {
//       console.error('Error updating product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });


/*Using async/await syntax*/
app.put('/api/products/asins/:asin', async (req, res) => {
  try {
    const asin = req.params.asin;
    const { title, price } = req.body;

    // Find the product by asin
    const product = await Product.findOne({ asin });

    // If the product with the provided asin is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the title and price fields
    product.title = title;
    product.price = price;

    // Save the updated product
    await product.save();

    // Send a success response
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Delete an existing product by _id
/*Using promises*/
// app.delete('/api/products/:product_id', validateProductId, (req, res) => {
//   const productId = req.params.product_id;
  
//   // Check if the provided product ID is a valid ObjectId
//   if (!ObjectId.isValid(productId)) {
//     return res.status(400).json({ error: 'Invalid product ID' });
//   }

//   Product.deleteOne({ _id: productId })
//     .then(result => {
//       if (result.deletedCount === 1) {
//         res.json({ message: 'Product successfully deleted' });
//       } else {
//         res.status(404).json({ error: 'Product not found' });
//       }
//     })
//     .catch(err => {
//       console.error('Error deleting product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });

/*Using async/await syntax*/
app.delete('/api/products/:product_id', validateProductId, async (req, res) => {
  try {
    const productId = req.params.product_id;
    
    // Check if the provided product ID is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const result = await Product.deleteOne({ _id: productId });
    if (result.deletedCount === 1) {
      res.json({ message: 'Product successfully deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an existing product by asin
/*Using promises*/
// app.delete('/api/products/asins/:asin', (req, res) => {
//   Product.deleteOne({ asin: req.params.asin })
//     .then(result => {
//       if (result.deletedCount === 1) {
//         res.json({ message: 'Product successfully deleted' });
//       } else {
//         res.status(404).json({ error: 'Product not found' });
//       }
//     })
//     .catch(err => {
//       console.error('Error deleting product:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });


/*Using async/await syntax*/
app.delete('/api/products/asins/:asin', async (req, res) => {
  try {
    const result = await Product.deleteOne({ asin: req.params.asin });
    if (result.deletedCount === 1) {
      res.json({ message: 'Product successfully deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log("App listening on port : " + port);
});
