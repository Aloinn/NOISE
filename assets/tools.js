const jwt = require('jsonwebtoken');
const database = require('./database');

// CHECKS IF AUTHORIZED
function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.status(401).send()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if(err) {console.log(err)
      return res.sendStatus(403)}
    req.user = user
    next()
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


exports.authenticateToken = authenticateToken
exports.createProjectId = createProjectId
