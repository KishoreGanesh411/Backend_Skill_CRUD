
const monggose=require('mongoose')
// const Schema = monggose.Schema;

const skillSchema =monggose.Schema({
    name: String,
    archived: Boolean,
    tags: [String],
  },{

    timestamps:true
})


const Skill = monggose.model('Skill',skillSchema);
module.exports=Skill;