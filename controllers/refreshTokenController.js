const UserDB={
    users: require("../model/users.json"),
    setUsers:function (data){this.users=data}
}

const jwt=require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken=(req,res)=>{
    const cookies=req.cookies
    if(!cookies?.jwt)return res.sendStatus(401)

    console.log(cookies.jwt)
    const refreshToken=cookies.jwt

    const foundUser=UserDB.users.find(person=>person.refreshToken===refreshToken)

    if (!foundUser){
        return res.status(403).json({"Message":"Forbidden"})
    }

    // evaluate jwt 

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err||foundUser.username!==decoded.username){
                return res.sendStatus(403)
            }

            const roles=Object.values(foundUser.roles)

            const accessToken=jwt.sign(
                {"UserInfo":
                    {
                        "username":decoded.username,
                        "roles":roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30s'}//30 seconds
            )
            res.json({accessToken})
        }
    )
}
module.exports={handleRefreshToken}