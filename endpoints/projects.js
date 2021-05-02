const tools = require('../assets/tools')
const database = require('../assets/database')
const mongoose = require('mongoose')

module.exports = function(app){

  // CREATE PROJECT
  app.post('/projects', tools.authenticateToken, async (req, res) => {

    // PUSH TO DATABASE
    const user = await database.User.findOne({"_id": req.user._id})

    const project = await database.Project.create({
      name: req.body.name,
      description: req.body.description,
      images: req.body.image,
      tags: req.body.tags,
      owner: user._id,
      collaborators: req.body.collaborators
    });
    user.projects.push(project._id)
    await user.save()
    res.status(200).send()
  })

  // GET PROJECT USING ID
  app.get('/projects/:id', async (req, res)=>{
    const project = await database.Project.findOne({"_id": req.params.id})
    if (project==null){ return res.status(400).send("Project does not exist")}
    else{ res.status(200).json({project}) }
  })

  // DELETE PROJECT
  app.delete('/projects/:id', tools.authenticateToken, async (req, res)=>{
    const project = await database.Project.findOne({"_id": req.params.id})
    if (project==null){ return res.status(400).send("Project does not exist")}
    else{
      if(req.user._id.toString() == project.owner.toString()){
        const project = await database.Project.findOneAndDelete({"_id": req.params.id})
        res.status(200).send("Project deleted!")
      } else {
        res.status(400).send("Only the project owner may delete")
      }
    }
  })

  // GET RECOMMENDED PROJECTS [AUTH]
  app.get('/projects/recommended', tools.authenticateToken, async(req, res) =>{
    const projects = database.Project.find( { tags: { $all: ["red", "blank"] } } )
  })

  // MATCH WITH A PROJECT
  app.get('/projects/match', tools.authenticateToken, async(req, res) =>{
    console.log()
  })
}
