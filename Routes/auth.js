const express=require("express")
const Router=express.Router()
const authController=require("../controllers/authController")

Router.post('/',authController.handleLogin)

module.exports=Router