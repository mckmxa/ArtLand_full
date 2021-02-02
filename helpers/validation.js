const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
const db = require('../config/connection');

dotenv.config({ path: './.env' })

const secret = process.env.SECRET

module.exports = {
    secret : secret,
    validJWTNeeded: (req, res, next) => {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ')
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send()
                } else {
                    req.jwt = jwt.verify(authorization[1], secret);
                    return next();
                }
            } catch (err) {
                return res.status(403).send("Authentication failed")
            }
        } else {
            return res.status(401).send("No authorization header found.")
        }
    },    
    hasAuthFields: (req, res, next) => {
        let errors = []

        if (req.body) {
            /*if (!req.body.email) {
                errors.push('Missing email field')
            }
            */
            if (!req.body.password) {
                errors.push('Missing password field')
            }
            if (!req.body.username) {
                errors.push('Missing username field')
            }

            if (errors.length) {
                return res.status(400).send({errors: errors.join(',')})
            } else {
                return next()
            }
        } else {
            return res.status(400).send({errors: 'Missing username and password fields'})
        }
    },
    // obecnie uzytkownik musi podczas logowania podac username i haslo - w celu zmiany odkomentowac odp komentarze
    doesPasswordAndUserMatch: async (req, res, next) => {
        const myPlaintextPassword = req.body.password
        //const myEmail = req.body.email
        const myUsername = req.body.username
        db.database.query(`SELECT * FROM users WHERE username LIKE '${myUsername}'`, async (error, user) => {
        if (error) throw error
        if (user.length>0) {
            const match = await bcrypt.compare(myPlaintextPassword, user[0].password);
            
            if (match) {
                req.username = user[0].username
                req.email = user[0].mail
                req.role = user[0].role
                req.id = user[0].id
                
                next()
            } else {
                res.status(401).json({success : false, error : "Username or password incorrect"})
            }
            
        } else {
            //res.status(401).send("Username/Email or password incorrect")
            res.status(401).json({success : false, error : "Username or password incorrect"})
        }
    })
    }
};