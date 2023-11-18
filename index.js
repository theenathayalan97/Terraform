const express = require("express")
var app=express();
const port = 8002
// require('./connection/database')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const aws_router = require("./router/awsRouter")
const azure_router = require("./router/azureRouter")

app.use("/api/v1",aws_router)
app.use("/api/v1",azure_router)


//server port 
app.listen(port,()=>{
    console.log("Server has started successfully")
})


