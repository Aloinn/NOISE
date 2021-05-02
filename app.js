require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8013;

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const users = []
const projects = []

require('./assets/database').connect()

app.listen(
  PORT,
  () => console.log(`alive on http://localhost:${PORT}`)
)

require('./endpoints/users')(app);
require('./endpoints/projects')(app);
const tools = require('./assets/tools')

app.get('/test', tools.authenticateToken, (req, res)=>{
  console.log(req.user)
  res.status(200).send()
})
