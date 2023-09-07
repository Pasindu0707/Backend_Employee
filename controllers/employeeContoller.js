const Employee=require("../model/Employee")



//get All Employee
const getAllEmployees=async (req,res)=>{
    const employee=await Employee.find()
    if(!employee) return res.status(204).json({"Meassage":"No employee found"})
    res.json(employee)
}


//Creating an employee
const createNewEmployee=async (req,res)=>{
    if(!req?.body?.firstname||!req?.body?.lastname){
        return res.status(400).json({"Meassage":"First name and Last Name are required"})
    }


    try{
        const newEmployee=await Employee.create({
            firstname:req.body.firstname,
            lastname:req.body.lastname
        })
        res.status(201).json(newEmployee)
    }catch(err){
        console.log(err)
    }
}
    

//Update employee
const updateEmployee=async (req,res)=>{
    if(!req?.body?.id){
        return res.status(400).json({"Message":"An Id is required as a parameter"})
    }
    
    const employee=await Employee.findById({_id:req.body.id}).exec()

    if(!employee){
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`})
    }

    if (req.body?.firstname){
       employee.firstname= req.body.firstname
        }    
    if(req.body?.lastname){
        employee.secondname=req.body.scondname
    }
    const result =await employee.save()
    res.json(result)
}


//delete Employee

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne({ _id: req.body.id })
    res.json(result);
}


//Find empliyee by id
const getEmployee=async (req,res)=>{
    if(!req?.params?.id){
        return res.status(400).json({"Message":"An Id is required as a parameter"})
    }
    
    const employee=await Employee.findById(req.params.id).exec()
  
    if(!employee){
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`})
    }
    res.json(employee)
}


module.exports={
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}