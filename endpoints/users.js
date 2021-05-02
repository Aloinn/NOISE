const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('../assets/database')
const tools = require('../assets/tools')
const mongoose = require('mongoose')

module.exports = function(app){

  // SPECIFIC USER
  app.get('/user/:id', async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){return res.status(400).send("User does not exist")}
    const user = await database.User.findOne({"_id": req.params.id})
    if (user==null){ return res.status(400).send("User does not exist")}

    // SUCCESS
    res.status(200).json({user})
  });

  // SPECIFIC USER
  app.put('/user/:id', tools.authenticateToken, async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){return res.status(400).send("User does not exist")}
    const user = await database.User.findOne({"_id": req.params.id})
    if (user==null){ return res.status(400).send("User does not exist")}

    // SUCCESS
    if(req.body.name!=null){user.name = req.body.name}
    if(req.body.city!=null){user.city = req.body.city}
    if(req.body.email!=null){user.email = req.body.email}
    if(req.body.bio!=null){user.bio = req.body.bio}
    if(req.body.tags!=null){user.tags = req.body.tags}
    user.save()
    res.status(200).json({user})

  });

  // GET RECOMMENDED USERS [AUTH]
  app.get('/users/recommended', tools.authenticateToken, async(req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.body.id)){return res.status(400).send("User does not exist")}
    const project = await database.Project.findOne({"_id": req.body.id})
    if (project==null){ return res.status(400).send("Project does not exist")}

    // SUCCESS
    const users = await database.User.find( { tags: { $in: req.user.tags }, owner: { $ne: req.user._id} } )
    res.status(200).send(users)
  })

  // REGISTER
  app.post('/users', async (req, res) => {

    // PASSWORD HASHING
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // PUSH TO DATABASE
    const _user = await database.User.findOne({"email": req.body.email})
    if(_user!=null){ return res.status(400).send("User with email already exists"); }

    const user = await database.User.create({
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      bio: req.body.bio,
      projects: [],
      tags: req.body.tags,
      password: hashedPassword
    });

    // GIVE USER JSONWEBTOKEN
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({accessToken: accessToken, user:user._id})

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
          res.status(200).json({accessToken: accessToken, user:user._id})

          //UNSUCESSFUL
        } else {res.status(400).send("Not allowed")}
      }

    // ERROR
    } catch { res.status(500).send() }
  })
}
