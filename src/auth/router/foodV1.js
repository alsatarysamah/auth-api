const express = require("express");
const { json } = require("express/lib/response");

const {foodCollection} = require("../models/index");
const foodRouter = express.Router();
foodRouter.get("/api/v1/food",getAll);
foodRouter.post("/api/v1/food",creatRecord);
foodRouter.put("/api/v1/food/:id",updating);
foodRouter.delete("/api/v1/food/:id",deleting);
foodRouter.get("/api/v1/food/:id",getOneRecored);

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