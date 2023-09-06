const express=require('express')
const app=express()
const path=require('path')
const cors=require('cors')
const corsOptions=require("./config/corsOptions")
const {logger}=require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT=require('./middleware/verifyJWT')
const cookieParser=require('cookie-parser')
const credentials=require('./middleware/credentials')

const PORT=process.env.PORT || 3500

//custom middle ware
app.use(logger)

//handle options credentials check-before cors
//and fetch cookies credentials requirements
app.use(credentials)


//cors
app.use(cors(corsOptions))


//adding middle ware

app.use(express.urlencoded({extended:false}))//to get form data to res body

app.use(express.json()) //to get json data

app.use(cookieParser())

app.use(express.static(path.join(__dirname,'/public'))) //to serve static files
app.use('/subdir',express.static(path.join(__dirname,'/public')))


//using the routes
app.use('/subdir',require('./Routes/subdir'))
app.use('/',require('./Routes/root'))
app.use('/register',require('./Routes/register'))
app.use('/auth',require('./Routes/auth'))
app.use('/refresh',require('./Routes/refresh'))
app.use('/logout',require('./Routes/logout'))

//protected Routes
app.use(verifyJWT)
app.use('/employees',require('./Routes/api/employees'))


//404
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }
    else if(accepts('json')){
        res.json({Error:"404 Not Found"})
    }
    else{
        res.type('txt').send("Not Found 404")
    }
})

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Running on port ${PORT}`))