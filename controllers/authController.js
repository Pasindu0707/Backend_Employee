const User=require("../model/User")
const jwt=require('jsonwebtoken')
const bcrypt=require ('bcrypt')

const handleLogin=async(req,res)=>{
    const {user,pwd}=req.body
    if(!user|| !pwd){
        return res.status(400).json({"Message":"Username and passwrod required"})
    }

    const foundUser=await User.findOne({username:user}).exec()
    if (!foundUser){
        return res.status(401).json({"Message":"Unortherized"})
    }

    const match=await bcrypt.compare(pwd,foundUser.password)

    if(match){
        const roles = Object.values(foundUser.roles);
        // create JWTs

        const accessToken=jwt.sign(
            {"UserInfo":{
                "username":foundUser.username,
                "roles":roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'30s'}//30 seconds
        )

        const refreshToken=jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        )

        //saving refresh token with current user
        foundUser.refreshToken=refreshToken
        const result=await foundUser.save()
        console.log(result) 

        res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',maxAge:24*60*60*1000})  //secure:true
        res.json({accessToken})
    }
    else{
        res.sendStatus(401)
    }
}

module.exports={handleLogin}