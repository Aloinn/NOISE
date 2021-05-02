const mongoose = require('mongoose');
const Schema = mongoose.Schema
db = null

// CONNECT TO DATABASE
async function connect(){
  const uri = "mongodb+srv://vietdemons:coolbeans@cluster0.ulape.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  db = mongoose.connection;
}


const userSchema = new Schema({
  name: String,
  city: String,
  bio: String,
  email: String,
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  tags: [String],
  password: String,
})

const projectSchema = new Schema({
  name: String,
  description: String,
  images: [String],
  tags: [String],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: Schema.ObjectId, ref: 'User' }],
})

const User = mongoose.model('User', userSchema)
const Project = mongoose.model('Project', projectSchema)

exports.connect = connect
exports.userSchema = userSchema
exports.db = db
exports.User = User
exports.Project = Project
