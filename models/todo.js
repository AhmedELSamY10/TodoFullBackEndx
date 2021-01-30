const mongoose  = require('mongoose');
require('./user')
require('./group')

const TodoSchema = new mongoose.Schema({
    title:{
        type:String,
         min: 3,maxlength:100,
        required: [true, "can't be blank"],
    },
    body :{
         type: String,
         min: 10,
         maxlength:500
    },
    status: { 
         type:String,
         default:"to-do",
         enum:["in-progress","to-do","done"]
         },
     user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    group :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    }
    

},{
    timestamps:true
})

const Todo = mongoose.model('Todo',TodoSchema);
module.exports = Todo

