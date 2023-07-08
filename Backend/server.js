const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors =require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'categories',
  port:'3306'
});

db.connect((err =>{
  if(err){
    console.log('Database connection error')
  }else{
    console.log('Database connection successful')
  }
}));

// show all database

app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM category';
db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//search record in category table
app.get('/categories/:categoryId', (req, res) => {
  const CategoryId=req.params.categoryId;
  const query = 'SELECT * FROM category where categoryId='+CategoryId;
db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//Add category table

app.post('/categories',(req, res) => {
  const name = req.body.categoryName;
  const query = 'insert into category(categoryName) values (\''+name+'\')';
  db.query(query, name, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.sendStatus(200);
    }
  });
});

//update category table
app.put('/categories/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const { categoryName } = req.body;
  if (!categoryName) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }
  const query = 'UPDATE category SET categoryName = (\''+categoryName+'\') WHERE categoryId = (\''+categoryId+'\')';
  db.query(query, [categoryName, categoryId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error updating category' });
      return;
    }
    res.json(result);
  });
});

//delete category

app.delete('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = 'DELETE FROM category WHERE categoryId = ?';
  db.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error deleting category' });
      return;
    }
    res.json(result);
  });
});



//product
app.get('/product', (req, res) => {
  const query = 'SELECT * FROM products';
db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/product/:productId', (req, res) => {
  const { productId } = req.params;
  const query = 'SELECT * FROM products WHERE productId =?';
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
      } else {
      res.json(results);
    }
})
});

//add product 

app.post('/product', (req, res) => {
  const { productName, categoryId } = req.body;

  const sql = 'INSERT INTO products (productName, categoryId) VALUES (?, ?)';
  const values = [productName, categoryId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding product: ', err);
      res.status(500).json({ error: 'Failed to add product' });
      return;
    }

    res.status(200).json({ message: 'Product added successfully' });
  });
});

//update product list

app.put('/product/:productId', (req, res) => {
  const productId = req.params.productId;
  const { productName, categoryId } = req.body;

  const sql = 'UPDATE products SET productName = ?, categoryId = ? WHERE productId = ?';
  const values = [productName, categoryId, productId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating product: ', err);
      res.status(500).json({ error: 'Failed to update product' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product updated successfully' });
  });
});

//delete product

app.delete('/product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE productId =?';
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to delete product' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
