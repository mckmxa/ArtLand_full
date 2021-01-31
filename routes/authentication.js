const express = require('express')
const {check, validationResult, body} = require('express-validator')
const router = express.Router()
const valid = require('../helpers/validation')
const db = require('../config/connection')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// `SELECT * FROM users WHERE email LIKE '${value}' OR username LIKE '${_value}'`
//`INSERT INTO USERS (username, password, email, fname, lname, role) VALUES (${username}, ${password}, ${email}, ${lname}, ${fname}, ${role})`


// LOGIN ROUTE
router.post('/login', [valid.hasAuthFields, valid.doesPasswordAndUserMatch], (req, res) => {
    let token = jwt.sign({state: 'true', username: req.body.username}, valid.secret, {
        algorithm: 'HS512',
        expiresIn: '4h'
    });
    res.json({token: token, auth: true, username: req.body.username, role: req.role});
    console.log("Login successful")
});


// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
    body('email').custom((value, {req}) => {
        return new Promise((resolve, reject) => {
         db.database.query(`SELECT username FROM users WHERE email = ?`, req.body.email,(err,res)=> 
      {
        if(err) {
          reject(new Error('Server Error'))
        }
        if(res.length > 0) {
          reject(new Error('E-mail already in use'))
        }
        resolve(true)
        })
      })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {

        let email = req.body.email;
        let username = email.split("@")[0];
        let password = await bcrypt.hash(req.body.password, 10);
        let fname = req.body.fname;
        let lname = req.body.lname;
        let role = 'ROLE_USER'// default role user

        db.database.query(`INSERT INTO users (username, password, email, fname, lname, role) VALUES ('${username}', '${password}', '${email}', '${fname}', '${lname}', '${role}')`, (error, results) => {
            if (error) res.status(433).json({error})
            if (results.insertId > 0) {
                res.status(201).json({message: 'Registration successful.'});
            } else {
                res.status(501).json({message: 'Registration failed.'});
            }
        })     
    }
});


module.exports = router;