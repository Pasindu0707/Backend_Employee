const User=require("../model/User")

const handleLogout=async(req,res)=>{
    const cookies=req.cookies

    if (!cookies?.jwt) return res.sendStatus(204)
    
    const refreshToken=cookies.jwt

    const foundUser=await User.findOne({refreshToken}).exec()

    if(!foundUser){
        res.clearCookie('jwt',{httponly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000})
    
        return res.sendStatus(204)
    }
    //deleting from DB

    foundUser.refreshToken=' '
    const result=await foundUser.save()
    console.log(result) //to get the changes to console // remove when production

    res.clearCookie('jwt',{httponly:true,sameSite:'None',secure:true,maxAge:27*60*60*1000})

    res.sendStatus(204)

}

module.exports={handleLogout}