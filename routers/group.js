const express = require('express');
const User = require('../models/user')
const groupRouter = new express.Router();


groupRouter.get('/getGroups',async(req,res)=>{
    try{
        const userById = await User.findById(req.signedData.id);
        res.send(userById.groups)
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

groupRouter.post('/addGroup'  , async (req,res)=>{
    try{ 
        const userById = await User.findById(req.signedData.id);
        userById.groups.push(req.body);
        await userById.save();
        res.statusCode = 201;
        res.send(userById.groups);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

module.exports = groupRouter;