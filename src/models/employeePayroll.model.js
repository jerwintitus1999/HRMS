const mongoose = require("mongoose");

const employeePayrollSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    employeeData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to Employee model
      required: true,
    },
    grossSalary: {
      type: Number,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
    },
    overTimePayPerHour: {
      type:Number
    },

    // Leave and Permission Allowed
    casualLeave: {
      type: Number,
      default: 1,
    },
    sickLeave: {
      type: Number,
      default: 1,
    },
    permission: {
      type: Number,
      default: 2,
    },
    late: {
      type: Number,
      default: 3,
    },

    // PF and ESI
    isPFIncluded: {
      type: Boolean,
      default: false,
    },
    isESIIncluded: {
      type: Boolean,
      default: false,
    },
    pfNumber: {
      type: String,
    },
    uanNumber: {
      type: String,
    },
    esiNumber: {
      type: String,
    },
  },
  {
    timestamps: true, collection: "employeePayroll"
  }
);

const EmployeePayroll = mongoose.model("employeePayroll", employeePayrollSchema);

module.exports = {EmployeePayroll};
