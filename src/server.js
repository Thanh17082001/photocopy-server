const express = require('express')
import session  from 'express-session'
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
// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
/
// routers
routers(app)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server runing with localhost:${port}`);
})