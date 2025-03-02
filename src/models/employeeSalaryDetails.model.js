const mongoose = require("mongoose");

const payrollConfigSchema = new mongoose.Schema({
  basic: {
    type: Number,
    required: true,
  },
  hra: {
    type: Number,
    required: true,
  },
  conveyance: {
    type: Number,
    required: true,
  },
  pf: {
    type: Number,
    required: true,
  },
  esi: {
    type: Number,
    required: true,
  },
});

const payrollSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    payrollConfig: {
      type: payrollConfigSchema, // Embedding payrollConfig as a sub-document
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "employeeSalaryDetails", // Custom collection name (optional)
  }
);

const Payroll = mongoose.model("employeeSalaryDetails", payrollSchema);

module.exports = {Payroll};
