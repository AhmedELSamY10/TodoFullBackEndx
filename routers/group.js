const express = require('express');
const User = require('../models/user')
const Todo = require('../models/todo')
const Group = require('../models/group')

const groupRouter = new express.Router();



groupRouter.get('/getGroups',async(req,res)=>{
    try{
        const groups = await Group.find({});          //router get all the groups
        res.send(groups)
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})



groupRouter.post('/addGroup'  , async (req,res)=>{
    try{                                                            //add a new group 
        const {name, Category} = req.body;
        const userById = await User.findById(req.signedData.id);
        const group = await Group.create({name:name, Category:Category ,user:req.signedData.id })
        userById.groups.push(group);
        await userById.save();
        res.statusCode = 201;
        res.send(group);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

groupRouter.patch('/updateGroup/:id' , async (req, res) => {
    try{
        const {name, Category} = req.body;                                  //update group info
        const {id} = req.params;
        const group = await Group.updateOne({ _id: id },{$set: {name:name, Category:Category} } );
        res.send(group);
    }
    catch(err){
        console.error(err);
        res.json({success: false, message: err.message});
    }
    })

    groupRouter.delete('/deleteGroup/:id' , async (req, res) => {
        try{
            const {id} = req.params;
            const userById = await User.findById(req.signedData.id);   //user own the group
            const groupById = await Group.findById(id);                    // the group it self

            for(let i =0;i<groupById.todos.length;i++)
            {
                const deletedtodos = await Todo.deleteOne({ _id: groupById.todos[i] } );   //delete the todos inside the group
                await groupById.save();
                userById.todos.pull( groupById.todos[i]);                                  // deleteb the todos of the group from user array of todos
                await userById.save();
            }

            const deletedGroup = await Group.deleteOne({ _id: id } );                           //delete the group

            userById.groups.pull(id);                                           // delete the group from the user group array
            await userById.save();
            res.send(deletedGroup);
        }
        catch(err){
            console.error(err);
            res.json({success: false, message: err.message});
        }
        })

            



module.exports = groupRouter;