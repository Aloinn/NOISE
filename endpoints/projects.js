const tools = require('../assets/tools')
const database = require('../assets/database')

module.exports = function(app){

  // CREATE PROJECT
  app.post('/projects', tools.authenticateToken, (req, res) => {
    const project = {
      id: tools.createProjectId(),
      name: req.body.name,
      description: req.body.description,
      images: req.body.image,
      tags: req.body.tags
    }
    const user = database.users.find((user)=>user.name==req.user.name)
    user.projects.push(project.id)
    database.projects.push(project)
    res.status(200).send()
  })

  // GET ALL PROJECTS
  app.get('/projects', (req, res) =>{
    console.log(database.projects)
    res.status(200).send()
  })

  // GET PROJECT USING ID
  app.get('/projects/:id', (req, res)=>{
    console.log(req.params.id)
    const project = database.projects.find((project)=>project.id==req.params.id)
    if (project==null){ return res.status(400).send("Project does not exist")}
    console.log(project)
    res.status(200).json({project})
  })

  // GET RECOMMENDED PROJECTS [AUTH]
  app.get('/projects/recommended', tools.authenticateToken, async(req, res) =>{
    console.log()
  })

  // MATCH WITH A PROJECT
  app.get('/projects/match', tools.authenticateToken, async(req, res) =>{
    console.log()
  })
}
