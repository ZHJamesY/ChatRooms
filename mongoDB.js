const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch(()=>{
    console.log("Couldn't connect to MongoDB");
  })

const Schema = mongoose.Schema;

const accountsSchema = new Schema({
    Username: String,
    Password: String
},
{
    collection: 'Accounts',
    versionKey: false
});

module.exports.Accounts = mongoose.model('accounts', accountsSchema);