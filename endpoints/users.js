const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('../assets/database')
const tools = require('../assets/tools')

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

      // PASSWORD HASHING
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = {
        name: req.body.name,
        email: req.body.email,
        projects: [],
        test: 2,
        password: hashedPassword,
      }

      // PUSH TO DATABASE
      database.users.push(user)

      // GIVE USER JSONWEBTOKEN
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({accessToken: accessToken})

      // ERROR
    } catch {res.status(500).send()}
  })

  // LOGIN
  app.post('/users/login', async (req, res) => {
    const user = database.users.find((user) => user.name==req.body.name)
    if (user == null){ return res.status(400).send("No users") }
    try {
      // COMPARES PASSWORD HASH
      const result = await bcrypt.compare(req.body.password, user.password)
      if(result){

        // SUCCESSFUL LOGIN, SET JSONWEBTOKEN
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({accessToken: accessToken})

        //UNSUCESSFUL
      } else {res.status(400).send("Not allowed")}

    // ERROR
    } catch { res.status(500).send() }
  })
}
