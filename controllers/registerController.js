const User=require('../model/User')
const bcrypt=require('bcrypt')

const hadleNewUser=async(req,res)=>{
    const {user,pwd}=req.body
    if(!user||!pwd){
        return res.status(400).json({"message":"User name and password required"})
    }

    const duplicate =await User.findOne({username:user}).exec()
    if(duplicate){
        return res.status(409)//conflict
    }
    try{
        const hashedPass=await bcrypt.hash(pwd,10)

        //Storing new user and create 
        const result=await User.create({
            "username":user,
            //"roles":{"User":2001},          //Beacouse we have defined normal user as default 
            "password":hashedPass
        })
        console.log(result)
        res.status(201).json({"Success":`New user ${user} was created`})
    }catch(err){
        return res.status(500).json({"Message":err.message})
    }
}

module.exports={hadleNewUser}