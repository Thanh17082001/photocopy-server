const express = require('express')
import session  from 'express-session'
import passport from 'passport'
import cors from 'cors'
import dotenv from 'dotenv'
import connectToDb from './config/connectToDb'
import routers from './router'

const app = express()
dotenv.config()

//cors
app.use(cors())
// connect DB
connectToDb()
// json
app.use(express.json());
// body
app.use(express.urlencoded({extended: true}));
// static file
app.use(express.static('src/public'));
// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
/
// routers
routers(app)
//passport
app.use(passport.initialize());
app.use(passport.session())
//run
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server runing with localhost:${port}`);
})