const express = require("express");
const { json } = require("express/lib/response");
const bearer=require("../middleware/bearer");
const acl=require("../middleware/acl");
const {foodCollection} = require("../models/index");
const foodRouter = express.Router();

// const {getAll,deleting,getOneRecored,updating,creatRecord}=require("./apiHandlers")

foodRouter.get("/api/v2/food",bearer,acl("read"),getAll);
foodRouter.post("/api/v2/food",bearer,acl("create"),creatRecord);
foodRouter.put("/api/v2/food/:id",bearer,acl("update"),updating);
foodRouter.delete("/api/v2/food/:id",bearer,acl("delete"),deleting);
foodRouter.get("/api/v2/food/:id",bearer,acl("read"),getOneRecored);


////////////////creat=insert////////////////////
async function creatRecord(req,res){
    // console.log("body  "+json(req.body))
let newFood =req.body;
// console.log("new  "+newFood)
// console.log("model is  "+foodCollection);
let newRecored=await foodCollection.create(newFood);
res.status(201).json(newRecored);
// res.json(req.body)

}
///////////select *//////////////////
async function getAll(req,res){
    let foods = await foodCollection.read();
    res.status(200).json(foods);

}

///////////////update/////////
async function updating(req,res){

    let id = parseInt(req.params.id);
    let newRecored = req.body;
    let found = await foodCollection.read(id);
    if (found) {
        let updated = await found.update(newRecored);
        res.status(201).json(updated);
    }
}
/////////////delete///////////////
async function deleting(req,res){

    let id = parseInt(req.params.id);
    let deleted = await foodCollection.delete(id);
    res.status(204).json(deleted);
}

/////////////get one/////////////

async function getOneRecored(req,res)
{
    const id = parseInt(req.params.id);
    let recored = await foodCollection.read(id);
    res.status(200).json(recored);
}
module.exports=foodRouter;