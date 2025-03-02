const mongoose = require("mongoose");

const CompanyWorkingDaysSchema = new mongoose.Schema(
  {
    workingDay: {
      department_id: { type: String, required: true }, // Department ID
      departmentData: { type: String, required: true }, // Department Unique Identifier
      workingDays: { type: Number, required: true }, // Total Working Days in the Month
      leaveDays: { type: Number, required: true }, // Total Leave Days in the Month
      totalDays: { type: Number, required: true }, // Total Days in the Month
      month: { type: Number, required: true }, // Month (Numeric: 1-12)
      year: { type: Number, required: true }, // Year (e.g., 2024)
    },
  },
  { collection: "CompanyworkingDays" }
); // Ensure it maps to the correct collection name

const CompanyWorkingDays = mongoose.model(
  "CompanyworkingDays",
  CompanyWorkingDaysSchema
);

module.exports = {CompanyWorkingDays};
