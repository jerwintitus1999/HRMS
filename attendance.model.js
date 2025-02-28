const schemaFields = require("../utils/schemaFieldUtils");
const { getFormattedDates } = require("../utils/timeUtils");
const {createModel} = require("./default.model");


const modelName = 'Attendance'

const attendanceFields = {
    employeeData: schemaFields.UUIDReferenceField('Employee'),
    employee_id: schemaFields.RequiredStringField,
    status: schemaFields.EnumStringFieldWithRequired(['present', 'sick-leave', 'casual-leave', 'comp-off', 'absent', 'wfh', 'od']),
    checkIn: schemaFields.RequiredNumberField,
    checkOut: schemaFields.NumberField,
    date: schemaFields.RequiredNumberField,
    isApproved: schemaFields.BooleanFieldWithDefaultFalse,
    isOtApproved: schemaFields.BooleanFieldWithDefaultFalse,
    isPermissionApproved: schemaFields.BooleanFieldWithDefaultFalse,
    isLateApproved: schemaFields.BooleanFieldWithDefaultFalse,
    overAllLoginTime: schemaFields.NumberFieldWithDefault(0),
}

const attendanceMiddleware = [
    {
        type: "post",
        event: "find",
        handler: (docs) => {
            docs.forEach((doc, index) => {
                const obj = doc.toObject();
                obj.checkInString = getFormattedDates(obj.checkIn,"medium",false);
                obj.checkOutString = obj.doj? getFormattedDates(obj.checkOut,"medium",false) : null;
                obj.dateString = obj.dor? getFormattedDates(obj.date,"medium",false) : null;
                docs[index] = obj;
            });
        }
    },
    {
        type: "post",
        event: "findOne",
        handler: (doc,next) => {
            if(doc){
                doc.checkInString = getFormattedDates(doc.checkIn,"medium",true);
                doc.checkOutString = doc.doj? getFormattedDates(doc.checkOut,"medium",true) : null;
                doc.dateString = doc.dor? getFormattedDates(doc.date,"medium",false) : null;
                next();
            } else {
                next()
            }
        }
    }

]

const [ AttendanceSchema, AttendanceModel ] = createModel(modelName, attendanceFields, attendanceMiddleware);

module.exports = {AttendanceModel, modelName ,schemaFields:attendanceFields};