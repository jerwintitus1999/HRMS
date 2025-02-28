const schemaFields = require("../utils/schemaFieldUtils");
const { getFormattedDates } = require("../utils/timeUtils");
const {createModel} = require("./default.model");


const modelName = 'Employee'

const employeeFields = {
    name: schemaFields.RequiredStringField,
    mailId: schemaFields.RequiredStringField,
    mobileNumber: schemaFields.RequiredStringField,
    gender: schemaFields.EnumStringField(['male', 'female', 'other']),
    dob: schemaFields.RequiredNumberField,
    empId: {type:String},
    
    // for office use
    doj: {type:Number}, // Date of Joining
    dor: {type:Number}, // Date of Resignation
    officialMailId: {type:String},
    officialMobileNumber: {type:Number},
    organization_id: {type:String},
    organizationData: schemaFields.UUIDReferenceField("Organization"),
    department_id: {type:String},
    departmentData: schemaFields.UUIDReferenceField("Department"),
    designation_id: {type:String},
    designationData: schemaFields.UUIDReferenceField("Designation"),
}

const employeeMiddleware = [
    {
        type: "post",
        event: "find",
        handler: (docs) => {
            docs.forEach((doc, index) => {
                const obj = doc.toObject();
                obj.dobString = getFormattedDates(obj.dob,"medium",false);
                obj.dojString = obj.doj? getFormattedDates(obj.doj,"medium",false) : null;
                obj.dorString = obj.dor? getFormattedDates(obj.dor,"medium",false) : null;
                docs[index] = obj;
            });
        }
    },
    {
        type: "post",
        event: "findOne",
        handler: (doc,next) => {
            if(doc){
                doc.dobString = getFormattedDates(doc.dob,"medium",false);
                doc.dojString = doc.doj? getFormattedDates(doc.doj,"medium",false) : null;
                doc.dorString = doc.dor? getFormattedDates(doc.dor,"medium",false) : null;
                console.log(doc,"doc")
                next();
            }else{
                next()
            }
        }
    },
]

const [ EmployeeSchema, EmployeeModel ] = createModel(modelName, employeeFields,employeeMiddleware, [],{isActive:false});

module.exports = {EmployeeModel, modelName, schemaFields:employeeFields};