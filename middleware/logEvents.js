const path=require('path')
const {format}=require('date-fns')
const {v4:uuid}=require('uuid')
const fs=require('fs')
const fspromises=require('fs').promises

const logEvent=async(msg,logFilePath)=>{

    const date=`${format(new Date(),'yyyy/MM/dd\tHH/mm/ss')}`
    const massage= `${date}\t${uuid()}\t${msg}\n`

    try{
    if(!fs.existsSync(path.join(__dirname,'..','Logs'))){
        await fspromises.mkdir(path.join(__dirname,'..','Logs'))
    }

    await fspromises.appendFile(path.join(__dirname,'..','Logs',logFilePath),massage)
    }catch(err){
        console.error(err)
    }
}

const logger=(req,res,next)=>{
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method}\t${req.url}`)
    next()
}

module.exports={logger,logEvent}