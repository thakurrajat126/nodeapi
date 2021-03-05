const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const errorHandler = require('./helpers/errorHandler');
const cors = require('cors');

// .env file


const app = express();

//3rd party middleware to log requests
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

//mongoose

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
	console.log("MongoDB connected");
});

mongoose.connection.on("error" , err=>{
	console.log(`Problem connecting ${err}`);
});

//myownMiddleware
const myMW = (req,res,next) => {
	console.log("entered custom MW");
	next();
}

app.use(morgan('dev'));
//app.use(myMW);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors);

//routers
app.use(require('./routes/post').postRouter);
app.use(require('./routes/auth').authRouter);
app.use(require('./routes/user').router);


//errorHandlers
app.use(errorHandler.errorHandler);


let port = 8080;

app.listen(port,()=>{
	console.log(`running on port ${port}`);

});

console.log("inside ap.js");


process.on('uncaughtException', function (err) {
  console.error('An uncaught error occurred!');
  console.error(err.stack);
});