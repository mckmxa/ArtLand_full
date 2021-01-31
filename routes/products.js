const express = require('express')
const router = express.Router();
const db = require('../config/connection')
/* mysql module */
/*
http://localhost:3000/products
http://localhost:3000/products?page=x
http://localhost:3000/products/prodId
http://localhost:3000/products/category/catName
http://localhost:3000/products/category/catName?page=x
 */

 
 
function getAllProducts(req, res){
    //let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;   // sprawdzenie czy jest queryparam page, default na 1
    //const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // limit produktow na str
    //if (page > 0) {
        //offset = (page * limit) - limit    // 0, 10, 20, 30                 // 10, 20, 30, 40
    //} else {
        //offset = 0
        //}
    const prodsQuery = `SELECT p.id,p.title as name,p.image,p.description,p.price,p.quantity,p.short_desc,c.title as category FROM products as p  JOIN categories as c ON c.id = p.cat_id ORDER BY id` //  LIMIT ${limit} OFFSET ${offset}`
      db.database.query(prodsQuery, (error, results) => {
             if (error) throw error
        // payload
        let jsonResult = {
          'count':results.length,
          'products':results
        }
        // response
        if(results.length > 0){
            //let myJsonString = JSON.parse(JSON.stringify(jsonResult))
            //res.json(myJsonString)

            res.json(jsonResult);
            
        }
        else{
            res.json({message: "No products found on this page"})
        }
        res.statusCode = 200;
        res.end()
      })
  }

const getOneProduct = (req, res) => {
    let productId = req.params.prodId
    const prodQuery = `SELECT p.id,p.title as name,p.image,p.description,p.price,p.quantity,p.short_desc,c.title as category FROM products as p  JOIN categories as c ON c.id = p.cat_id WHERE p.id = ${productId}`
      db.database.query(prodQuery, (error, results) => {
             if (error) throw error
        // payload
        let jsonResult = {
          'product':results
        }
        // response
        if(results.length > 0){
            //let myJsonString = JSON.parse(JSON.stringify(jsonResult))
            //res.json(myJsonString)
            res.json(jsonResult);
        }
        else{
            res.json({message: `No product found with id ${productId}`});
        }
        res.statusCode = 200;
        res.end()

      })
  }

  const getAllFromCategory = (req, res) => {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;   // sprawdzenie czy jest queryparam page, default na 1
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; // limit produktow na str
    if (page > 0) {
        offset = (page * limit) - limit    // 0, 10, 20, 30                 // 10, 20, 30, 40
    } else {
        offset = 0
        }
    
    const cat_title = req.params.catName;

    const catQuery = `SELECT p.id,p.title as name,p.image,p.description,p.price,p.quantity,p.short_desc,c.title as category FROM products as p  JOIN categories as c ON c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%' ORDER BY id LIMIT ${limit} OFFSET ${offset}`
      db.database.query(catQuery, (error, results) => {
             if (error) throw error;
        //payload
        let jsonResult = {
            'count': results.length,
            'products':results
        }
        
        // response
        if(results.length > 0){

            //let myJsonString = JSON.parse(JSON.stringify(jsonResult))
            //res.json(myJsonString)
        
            res.json(jsonResult);
            
        }
        else{
            res.json({message: `No products found matching the category ${cat_title}`})
        }
        res.statusCode = 200;
        res.end()
      })
  }

router.get('/', getAllProducts)
router.get('/:prodId', getOneProduct)
router.get('/category/:catName', getAllFromCategory)


module.exports = router;