const UserDB={
    users:require("../model/users.json"),
    setUsers:function(data){this.users=data}
}

const fspromises=require('fs').promises
const path=require('path')
const bcrypt=require('bcrypt')

const hadleNewUser=async(req,res)=>{
    const {user,pwd}=req.body
    if(!user||!pwd){
        return res.status(400).json({"message":"User name and password required"})
    }

    const duplicate =UserDB.users.find(person=>person.username===user)
    if(duplicate){
        return res.status(409)//conflict
    }
    try{
        const hashedPass=await bcrypt.hash(pwd,10)

        const newUser={"username":user,
                        "roles":{"User":2001},          //Always a normal user
                        "password":hashedPass
                    }
        
        UserDB.setUsers([...UserDB.users,newUser])
        
        await fspromises.writeFile(path.join(__dirname,'..','model','users.json'),JSON.stringify(UserDB.users))
        console.log(UserDB.users);
    }catch(err){
        return res.status(500).json({"Message":err.message})
    }
}

module.exports={hadleNewUser}