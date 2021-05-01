require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8012;

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const users = []
const projects = []

app.listen(
  PORT,
  () => console.log(`alive on http://localhost:${PORT}`)
)

require('./users')(app);
require('./projects')(app);
tools = require('./tools')

app.get('/test', tools.authenticateToken, (req, res)=>{
  console.log(req.user)
  res.status(200).send()
})
