const express = require('express');
const router = express.Router();
const db = require('../config/connection');

// GET ALL ORDERS
const getAllOrders = (req, res) => {
    const ordersQuery = `SELECT o.id, p.title, p.description, p.price, u.username FROM orders_details as od JOIN orders as o ON o.id = od.order_id JOIN products as p on p.id = od.product_id JOIN users as u ON u.id = o.user_id ORDER BY o.id`
    db.database.query(ordersQuery, (error, results) => {
        if (error) throw error
    //payload
    /*let jsonResult = {
        'orders':results
    }
    */
    //response
    if (results.length > 0){
        //obydwa ok?
        //let myJsonString = JSON.parse(JSON.stringify(jsonResult))
        //res.json(myJsonString)
        res.json(results);
    }
    else{
        res.json({message: `No orders found`});
    }
    res.statusCode = 200;
    res.end()
    })
}

// Get Single Order
const getOneOrder = async (req, res) => {
    let orderId = req.params.id;
    const orderQuery = `SELECT o.id, p.title, p.description, p.price, p.image, od.quantity FROM orders_details as od JOIN orders as o ON o.id = od.order_id JOIN products as p ON p.id = od.product_id JOIN users as u ON u.id = o.user_id WHERE o.id = ${orderId}`
    db.database.query(orderQuery, (error, results) => {
        if (error) throw error
   // response
   if(results.length > 0){
       res.json(results)
   }
   else{
       res.json({message: `No product found with id ${orderId}`});
   }
   res.statusCode = 200;
   res.end()
 })
}

const placeNewOrder = async (req,res) => {
    let {userId, products} = req.body;
    if (userId !== null && userId > 0) {
        db.database.query(`INSERT INTO orders (user_id) VALUES (${userId})`, (error, newOrderId) => {
            if(error) throw error
            if(newOrderId.insertId > 0){
            products.forEach(async (p) => {
                    db.database.query(`SELECT quantity FROM products as p WHERE id = ${p.id}`, (error, results) => {
                    if(error) throw error
                    let inCart = parseInt(p.incart)
                    //console.log(results);
                    //console.log(p.id);
                    //console.log(results[p.id-1].quantity);
                    if (results[0].quantity > 0) {
                        results[0].quantity = results[0].quantity - inCart
                        if (results[0].quantity < 0) {
                            results[0].quantity = 0
                        }
                    } else {
                        results[0].quantity = 0
                    }
                //Insert order details with the newly created order Id
                db.database.query(`INSERT INTO orders_details (order_id, product_id, quantity) VALUES (${newOrderId.insertId}, ${p.id}, ${inCart})`, (error) => {
                    if(error) throw error
                    db.database.query(`UPDATE products SET quantity = ${results[0].quantity} WHERE id = ${p.id} `, (error) => {
                        if(error) throw error
                    })
                    
                })
            })
            })
        }else {
            res.json({message: 'New order failed while adding order details', success: false});
        }
        res.json({
            message: `Order successfully placed with order id ${newOrderId.insertId}`,
            success: true,
            order_id: newOrderId.insertId,
            products: products
        })
        res.statusCode = 200;
        res.end()
    })
    }
    else{
        res.json({message: 'New order failed', success: false});
    }
    
}

router.get('/', getAllOrders)
router.get('/:id', getOneOrder)
router.post('/new', placeNewOrder)


module.exports = router;