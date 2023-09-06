const UserDB={
    users: require("../model/users.json"),
    setUsers:function (data){this.users=data}
}

const jwt=require('jsonwebtoken')
require('dotenv').config()
const fspromises=require('fs').promises
const path=require('path')
const bcrypt=require ('bcrypt')
const jsonwebtoken = require("jsonwebtoken")

const handleLogin=async(req,res)=>{
    const {user,pwd}=req.body
    if(!user|| !pwd){
        return res.status(400).json({"Message":"Username and passwrod required"})
    }

    const foundUser=UserDB.users.find(person=>person.username===user)

    if (!foundUser){
        return res.status(401).json({"Message":"Unortherized"})
    }

    const match=await bcrypt.compare(pwd,foundUser.Password)

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

        const otherUsers=UserDB.users.filter(person=>person.username!==foundUser.username)
        
        const currentUser={...foundUser,refreshToken}

        UserDB.setUsers([...otherUsers,currentUser])
        await fspromises.writeFile(path.join(__dirname,'..','model','users.json'),JSON.stringify(UserDB.users))

        res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000})
        res.json({accessToken})
    }
    else{
        res.sendStatus(401)
    }
}

module.exports={handleLogin}