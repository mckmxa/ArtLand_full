const express = require('express');
const router = express.Router();
const db = require('../config/connection');
const bcrypt = require('bcrypt')
/* GET LIST OF USERS */ 
router.get('/', function (req, res) {
    db.database.query( `SELECT username, email, fname, lname, age, role, id FROM users`, (error, list) => {
        if (error) throw error
        if (list.length > 0) {
            res.json({users: list});
        } else {
            res.json({message: 'NO USER FOUND'});
        }
    });
});


/* GET ONE USER MATCHING ID */
router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    db.database.query(`SELECT username, email, fname, lname, age, role, id FROM users WHERE id = ${userId}` , (error, results) => {
        if (error) throw error
        if (results.length>0) {
            res.json({user : results});
        } else {
            res.json({message: `NO USER FOUND WITH ID : ${userId}`});
        }
    });
});

/* UPDATE USER DATA */
router.patch('/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get user ID from the parameter

  // Search user in database if there is any
    db.database.query(`SELECT * FROM users WHERE id = ${userId}`,async (error, user) =>{
    if (user.length > 0) {
        // check if body contains fields, if not dont change user data, if contains update user data
        let userPassword;
        let userEmail = req.body.email;
        if(req.body.password !== undefined)
        userPassword = await bcrypt.hash(req.body.password, 10)
        else
        userPassword = undefined;
        let userFirstName = req.body.fname;
        let userLastName = req.body.lname;
        let userUsername = req.body.username;
        let age = req.body.age;

        userEmail !== undefined ? userEmail = req.body.email : userEmail = user[0].email
        userPassword !== undefined ? userPassword = userPassword : userPassword = user[0].password
        userUsername !== undefined ? userUsername = req.body.username : userUsername = user[0].username
        userFirstName !== undefined ? userFirstName = req.body.fname : userFirstName = user[0].fname
        userLastName !== undefined ? userLastName = req.body.lname : userLastName = user[0].lname
        age !== undefined ? age = req.body.age : age = user[0].age

        db.database.query("UPDATE users SET email =?, password =?, username =?, fname = ?, lname =?, age =? WHERE id = ?", [userEmail, userPassword, userUsername, userFirstName, userLastName, age, userId ], (error, results) => {
            if (error) throw error
            if (results)
                res.json('User updated successfully')
        })
    }
})
})

module.exports = router;