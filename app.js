require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

app.get('/users', (req, res) => {
  res.status(200).json(users)
});

app.post('/users', async (req, res) => {
  const user = users.find((user) => user.name==req.body.name)
  if (user!=null){ return res.status(400).send("User exists")}
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }
    users.push(user)
    accessToken = "a"
    //const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    //print(accessToken)
    res.status(201).json({accessToken: accessToken})
  } catch {res.status(500).send()}
})

app.post('/users/login', async (req, res) => {
  const user = users.find((user) => user.name==req.body.name)
  if (user == null){ return res.status(400).send("No users") }
  try {
    const result = await bcrypt.compare(req.body.password, user.password)
    if(result){
      //const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      accessToken = "a"
      res.status(200).json({accessToken: accessToken})
    } else {
      console.log("SUCCES!S")
      res.status(400).send("Not allowed")
    }
  } catch { res.status(500).send() }
})

app.post('/projects', async(req, res) => {
  const project = {
    name: req.body.name,
    description: req.body.description,
  }
})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.status(401).send()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
