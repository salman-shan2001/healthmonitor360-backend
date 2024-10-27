const mongoose=require("mongoose")
const Schema=mongoose.Schema(
    {
        "name":{type:String,require:true},
        "phone":{type:String,require:true},
        "email":{type:String,require:true},
        "password":{type:String,require:true}
    }
)

const healthmodel=mongoose.model("users",Schema);
module.exports={healthmodel}