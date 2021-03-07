const express = require('express');
const User = require('../models/user')
const mongoose  = require('mongoose');

const todoRouter = new express.Router();




todoRouter.post('/addTodo'  , async (req,res)=>{
    try{                                       
        const userById = await User.findById(req.signedData.id);
        userById.todos.push(req.body);
        await userById.save();
        res.statusCode = 201;
        res.send(userById.todos);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

todoRouter.patch('/updateTodo/:id' , async (req, res) => {
    try{   
        const userById = await User.findById(req.signedData.id);        //update todo
        const {title, body ,status,group,time} = req.body;
        const {id} = req.params;
        const todo = userById.todos[id]
        todo.title = title;
        todo.body = body;
        todo.status = status;
        todo.group = group;
        todo.time = Date.now();
        await userById.save();
        res.send(todo);
    }
    catch(err){
        console.error(err);
        res.json({success: false, message: err.message});
    }
    })
    
todoRouter.delete('/deleteTodo/:id' , async (req, res) => {
        try{
            const userById = await User.findById(req.signedData.id);        
            const {id} = req.params;
            userById.todos.pull(userById.todos[id]);  
            await userById.save(); 
            res.send(userById.todos);
        }
        catch(err){
            console.error(err);
            res.json({success: false, message: err.message});
        }
        })
    
todoRouter.get('/', async (req,res)=>{                
    try{
        const userById = await User.findById(req.signedData.id);
        const {month,day,groupname} = req.query;
        if(month && day)
        {
         todos = await getTodosInMonthAndDay(userById,month,day)
        }
        else if(month)
        {
        todos = await getTodosInOneMonth(userById,month)
        }
        else if(day)
        {
        todos = await getTodosInOneDay(userById,day)
        }
        else if(!month && !day && !groupname)
        {
        todos = await getalltodos(userById)
        }
        else if(groupname)
        {
        todos = await gettodosbygroup(userById,groupname)
        }
        res.statusCode = 201;
        res.send(todos)
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})       

async function getTodosInMonthAndDay(userById,month,day){
    let todos=[];
    for (let i = 0; i < userById.todos.length ; i++)
        {
            if(userById.todos[i].time.getDate()===(parseInt(day))&&userById.todos[i].time.getMonth()===(parseInt(month)-1) )
            {
                todos.push(userById.todos[i])
            }
        }  
    return todos;
}

async function getTodosInOneDay(userById,day){
    let todos=[]
    for (let i = 0; i < userById.todos.length ; i++)
        {
            if(userById.todos[i].time.getDate()===(parseInt(day)))
            {
                todos.push(userById.todos[i])
            }
        }  

    return todos;
}

async function getTodosInOneMonth(userById,month){
    let todos=[]
    for (let i = 0; i < userById.todos.length ; i++)
        {
            if(userById.todos[i].time.getMonth()===(parseInt(month)-1))
            {
                todos.push(userById.todos[i])
            }
        }  

    return todos;
}

async function getalltodos(userById){
    return userById.todos
}

async function gettodosbygroup(userById,groupname){
    const common = []
    for (let i = 0; i < userById.todos.length ; i++)
    {
        if(userById.todos[i].group===groupname)
        {
            common.push(userById.todos[i])
        }
    }  
 return common;
}



module.exports = todoRouter;