const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mailId: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Number, // Assuming timestamp (milliseconds)
      required: true,
    },
    empId: {
      type: String,
    },

    // Office Use
    doj: {
      type: Number, // Date of Joining (timestamp)
    },
    dor: {
      type: Number, // Date of Resignation (timestamp)
    },
    officialMailId: {
      type: String,
    },
    officialMobileNumber: {
      type: Number,
    },
    organization_id: {
      type: String,
    },
    organizationData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization", // Reference to Organization model
    },
    department_id: {
      type: String,
    },
    departmentData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to Department model
    },
    designation_id: {
      type: String,
    },
    designationData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation", // Reference to Designation model
    },
  },
  {
    timestamps: true, collection: "employeeDetails"
  }
);

const Employee = mongoose.model("employee", employeeSchema);

module.exports = {Employee};
