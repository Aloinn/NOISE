const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('../assets/database')
const tools = require('../assets/tools')

module.exports = function(app){

  // SPECIFIC USER
  app.get('/users/:id', async (req, res) => {
    const user = await database.User.findOne({"_id": req.params.id})
    if (user==null){ return res.status(400).send("User does not exist")}
    else{ res.status(200).json({user}) }
  });

  // SPECIFIC USER
  app.put('/users/:id', tools.authenticateToken, async (req, res) => {
    const user = await database.User.findOne({"_id": req.params.id})
    if (user==null){ return res.status(400).send("User does not exist")}
    else{
      user.tags = req.body.tags
      user.save()
      res.status(200).json({user})
    }
  });

  // REGISTER
  app.post('/users', async (req, res) => {
    try {

      // PASSWORD HASHING
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

      // PUSH TO DATABASE
      let user = await database.User.findOne({"email": req.body.email})
      if(user!=null){ res.status(400).send("User with email already exists"); }
      else{
        let user = await database.User.create({
          name: req.body.name,
          email: req.body.email,
          projects: [],
          tags:[],
          password: hashedPassword,
        });

        // GIVE USER JSONWEBTOKEN
        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({accessToken: accessToken})
      }

      // ERROR
    } catch {res.status(500).send()}
  })

  // LOGIN
  app.post('/users/login', async (req, res) => {

    try {
      // COMPARES PASSWORD HASH
      const user = await database.User.findOne({"email": req.body.email})

      // USER EXISTS?
      if (user == null){ return res.status(400).send("No users") }
      else{
        const result = await bcrypt.compare(req.body.password, user.password)
        if(result){

          // SUCCESSFUL LOGIN, SET JSONWEBTOKEN
          const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
          res.status(200).json({accessToken: accessToken})

          //UNSUCESSFUL
        } else {res.status(400).send("Not allowed")}
      }

    // ERROR
    } catch { res.status(500).send() }
  })
}
