const UserDB={
    users: require("../model/users.json"),
    setUsers:function (data){this.users=data}
}

const fspromises=require('fs').promises
const path=require('path')

const handleLogout=async(req,res)=>{
    const cookies=req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken=cookies.jwt

    const foundUser=UserDB.users.find(person=>person.refreshToken===refreshToken)

    if(!foundUser){
        res.clearCookie('jwt',{httponly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000})
    
        return res.sendStatus(204)
    }
    //deleting from DB

    const otherUsers=UserDB.users.filter(person=>person.refreshToken!==foundUser.refreshToken)

    const currentUser={...foundUser,refreshToken: '' }

    UserDB.setUsers([...otherUsers,currentUser])
    await fspromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(UserDB.users)
    )

    res.clearCookie('jwt',{httponly:true,sameSite:'None',secure:true,maxAge:27*60*60*1000})

    res.sendStatus(204)

}

module.exports={handleLogout}