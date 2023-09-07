const express=require('express')
const router=express.Router()
const employeeController=require("../../controllers/employeeContoller")
const ROLES_LIST=require('../../config/roles_list')
const verifyRoles=require('../../middleware/verifyRoles')


router.route('/')
    .get(employeeController.getAllEmployees)

    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),employeeController.createNewEmployee)  //only admin and editor can add an employee

    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.updateEmployee)

    .delete(verifyRoles(ROLES_LIST.Admin),employeeController.deleteEmployee);     //only admin can remmove an employee

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports=router