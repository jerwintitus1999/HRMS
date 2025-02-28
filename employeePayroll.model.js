const schemaFields = require("../utils/schemaFieldUtils");
const {createModel} = require("./default.model");


const modelName = 'EmployeePayroll'

const employeePayrollFields = {
    employee_id : schemaFields.RequiredStringField,
    employeeData : schemaFields.UUIDReferenceField("Employee"),
    grossSalary: schemaFields.RequiredNumberField,
    bankName: schemaFields.RequiredStringField,
    bankAccountNumber: schemaFields.RequiredStringField,
    ifscCode: schemaFields.RequiredStringField,
    upiId: schemaFields.StringField,

    //leave and permission allowed
    casualLeave: schemaFields.NumberFieldWithDefault(1),
    sickLeave: schemaFields.NumberFieldWithDefault(1),
    permission: schemaFields.NumberFieldWithDefault(2),
    late: schemaFields.NumberFieldWithDefault(3),

    // pf and esi
    isPFIncluded: schemaFields.BooleanFieldWithDefaultFalse,
    isESIIncluded: schemaFields.BooleanFieldWithDefaultFalse,
    pfNumber : schemaFields.StringField,
    uanNumber: schemaFields.StringField,
    esiNumber: schemaFields.StringField,
}

const [ EmployeePayrollSchema, EmployeePayrollModel ] = createModel(modelName, employeePayrollFields,[],[],{strict:false,timestamps:true});

module.exports = {EmployeePayrollModel, modelName, schemaFields:employeePayrollFields};