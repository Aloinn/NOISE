const tools = require('./tools')

module.exports = function(app){

  // CREATE PROJECT
  app.post('/projects', tools.authenticateToken, async(req, res) => {
    const project = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      images: req.body.image,
      tags: req.body.tags
    }
    req.user.projects.push(project.id)
    projects.push(project)
  })

  // GET ALL PROJECTS
  app.get('/projects', async(req, res) =>{
    console.log()
  })

  // GET PROJECT USING ID
  app.get('/projects/:id', (req, res)=>{
    const project = projects.find((project)=>project.id==req.params.id)
    if (project!=null){ return res.status(400).send("Project does not exist")}
    res.status(200).json(project)
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
