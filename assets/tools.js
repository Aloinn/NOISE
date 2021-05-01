const jwt = require('jsonwebtoken');
const database = require('./database');

// CHECKS IF AUTHORIZED
async function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.status(401).send()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, object)=>{
    if(err) {console.log(err)
      return res.sendStatus(403)}

    // FIND IN DATABAS
    if(object==null){res.status(400).send("ERR")}{
      const user = await database.User.findOne({"_id": object.user._id})
      if(user!=null){
        req.user = user
        next()
      } else {res.status(400).send("ERR")}
    }
  })
}

// CREATES AN ID FOR A PROJECT
function createProjectId(){
  while (true){
    var id = '_' + Math.random().toString(36).substr(2, 9);
    if(database.projects.find((project) => project.id == id)==null){
      return id
    }
  }
}

// CREATES AN ID FOR A USER
function createUserId(){
  while (true){
    var id = '_' + Math.random().toString(36).substr(2, 9);
    if(database.users.find((user) => user.id == id)==null){
      return id
    }
  }
}

// FIND PROJECT BASED ON ID
function findProject(id,id2){
  return database.projects.find((project)=>project[id]==id2)
}

// FIND USER BASED ON ID
function findUser(id,id2){
  return database.users.find((user)=>user[id]==id2)
}

exports.authenticateToken = authenticateToken
exports.createProjectId = createProjectId
exports.createUserId = createUserId
exports.findProject = findProject
exports.findUser = findUser
