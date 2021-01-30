const express = require('express');
const User = require('../models/user')
const Todo = require('../models/todo')

const authenticationMiddleware = require('../middlewares/authentication');
const todoRouter = new express.Router();


todoRouter.get('/getTodos',async(req,res)=>{
    try{
        const todos = await Todo.find({});          //router get all the todos 
        res.send(todos)
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

todoRouter.use(authenticationMiddleware)


todoRouter.post('/addTodo'  , async (req,res)=>{
    try{                                                //add todo
        const {title, body ,status} = req.body;     
        const userById = await User.findById(req.signedData.id);
        const todo = await Todo.create({title:title, body:body ,status:status,user:req.signedData.id })
        userById.todos.push(todo);
        await userById.save();
        res.statusCode = 201;
        res.send(todo);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

todoRouter.patch('/updateTodo/:id' , async (req, res) => {
    try{                                                        //update todo
        const {title, body ,status} = req.body;
        const {id} = req.params;
        const todo = await Todo.updateOne({ _id: id },{$set: {title:title, body:body ,status:status}} );
        res.send(todo);
    }
    catch(err){
        console.error(err);
        res.json({success: false, message: err.message});
    }
    })
    
    todoRouter.delete('/deleteTodo/:id' , async (req, res) => {
        try{
            const {id} = req.params;                                    //delete todo
            const deletedtodo = await Todo.deleteOne({ _id: id } );

         
            const userById = await User.findById(req.signedData.id);
            userById.todos.pull(id);                        //and remove it from the user array of todos
            await userById.save();
            res.send(deletedtodo);
        }
        catch(err){
            console.error(err);
            res.json({success: false, message: err.message});
        }
        })
    
        todoRouter.get('/getTodosLimit',async(req,res)=>{
            try{                                                        //return the user todos with limit and skip
                var skip = 0 ; var limit = 10;
                if(req.query.limit){limit=req.query.limit}
                if(req.query.skip){skip=req.query.skip}
                const todos = await Todo.find({user:req.signedData.id},{limit:limit,skip:skip})
                res.send(todos)
            }
            catch(err){
                console.error(err);
                res.statusCode = 422;
                res.json({ success: false, message: err.message });
            }
        })
        

todoRouter.get('/userTodo'  , async (req,res)=>{                // reurn the user todos
    try{
        const userByPost = await Todo.find({user:req.signedData.id});
        res.statusCode = 201;
        res.send(userByPost);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})




module.exports = todoRouter;