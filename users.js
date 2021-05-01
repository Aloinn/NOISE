const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('./database')
const tools = require('./tools')

module.exports = function(app){

  // ALL USERS
  app.get('/users', (req, res) => {
    res.status(200).json(database.users)
  });

  // REGISTER
  app.post('/users', async (req, res) => {
    const user = database.users.find((user) => user.name==req.body.name)
    if (user!=null){ return res.status(400).send("Username already exists")}
    try {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      }
      database.users.push(user)
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({accessToken: accessToken})
    } catch {res.status(500).send()}
  })

  // LOGIN
  app.post('/users/login', async (req, res) => {
    const user = database.users.find((user) => user.name==req.body.name)
    if (user == null){ return res.status(400).send("No users") }
    try {
      const result = await bcrypt.compare(req.body.password, user.password)
      if(result){
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({accessToken: accessToken})
      } else {
        console.log("SUCCES!S")
        res.status(400).send("Not allowed")
      }
    } catch { res.status(500).send() }
  })
}
