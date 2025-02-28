const schemaFields = require("../utils/schemaFieldUtils");
const {createModel} = require("./default.model");


const modelName = 'PayrollConfig'

const payrollConfigFields = {
    basic: schemaFields.NumberFieldWithDefault(40), // of gross
    hra: schemaFields.NumberFieldWithDefault(75), // of basic
    conveyance: schemaFields.NumberFieldWithDefault(10), // of gross
    pf: schemaFields.NumberFieldWithDefault(12), // of basic
    esi: schemaFields.NumberFieldWithDefault(0.75) // of gross
}

const [ PayrollConfigSchema, PayrollConfigModel ] = createModel(modelName, payrollConfigFields);

module.exports = {PayrollConfigModel, modelName ,schemaFields:payrollConfigFields};