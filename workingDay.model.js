const schemaFields = require("../utils/schemaFieldUtils");
const {createModel} = require("./default.model");


const modelName = 'WorkingDay'

const workingDayFields = {
    department_id: schemaFields.RequiredStringField,
    departmentData: schemaFields.UUIDReferenceField('Department'),
    workingDays: schemaFields.RequiredNumberField,
    leaveDays: schemaFields.RequiredNumberField,
    totalDays: schemaFields.RequiredNumberField,
    month: schemaFields.RequiredNumberField,
    year: schemaFields.RequiredNumberField,
}

const [ WorkingDaySchema, WorkingDayModel ] = createModel(modelName, workingDayFields);

module.exports = {WorkingDayModel, modelName ,schemaFields:workingDayFields};