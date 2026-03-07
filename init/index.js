const mongoose = require("mongoose");
const initdata = require("./Data")
const model = require("../MODELS/listing");
const Listing = require("../MODELS/listing");

main().then((res)=>{
    console.log("connected to DB");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Maxhotel');

}

const initDB = async ()=>{
  await Listing.deleteMany({})
  initdata.data = initdata.data.map((obj)=>({...obj, owner:"69a134131fa794731def07f7"}));
  await Listing.insertMany(initdata.data)
  console.log("data was initialized")
}

initDB()