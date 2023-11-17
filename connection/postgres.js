const dbconfig=require('../connection/db.config')
const Sequelize=require('sequelize')

const database = new Sequelize("vpc","postgres","password1",{
    host:dbconfig.HOST,
    dialect:dbconfig.DIALECT
})

// database.authenticate()
// .then(()=>{
//     console.log("connect ....")
// }).catch(err => {
//     console.log("Error :" + err)
// })

const db={}
db.Sequelize=Sequelize;
db.database=database;
db.User=require("../schema/user")(database,Sequelize)

module.exports=db;