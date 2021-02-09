/* express module server */
var bodyParser=require("body-parser");
const express = require('express')
var http = require('http')
const app = express();
app.use(express.static(__dirname));

const dotenv = require('dotenv')
const path = require('path');

dotenv.config({ path: './.env' })
const port = process.env.DATABASE_PORT

//const generate = require('./helpers/generate_keys')

// wstepny router
const productsRoute = require('./routes/products')
const orderRoute = require('./routes/orders')
const authRoute = require('./routes/authentication')
const usersRoute = require('./routes/users')


app.use(express.json()) // w new order zeby moc pobierac dane z req.body 

app.use('/api/products', productsRoute)
app.use('/api/orders', orderRoute)
app.use('/api/auth', authRoute)
app.use('/api/users',usersRoute)

//app.set('port', process.env.PORT || 3000);
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
/*
app.use(function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
});
*/


app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/

module.exports = app