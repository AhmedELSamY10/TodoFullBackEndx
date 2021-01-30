const mongoose  = require('mongoose');
require('./todo')

const GroupSchema = new mongoose.Schema({
    name:{
        type:String,
         min: 3,maxlength:100,
        required: [true, "can't be blank"],
    },
    category :{
         type: String,
         min: 3,maxlength:100,
    },
    todos:[{
        type:mongoose.Schema.Types.ObjectId,    
        ref:'Todo'
    }],
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    

},{
    timestamps:true
})

const Group = mongoose.model('Group',GroupSchema);
module.exports = Group
