const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeData: {
    type: String, // For UUID Reference (if MongoDB supports UUID)
    ref: "Employee",
    required: true,
  },
  employee_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "sick-leave", "casual-leave", "comp-off", "absent", "wfh", "od"],
    required: true,
  },
  checkIn: {
    type: Number,
    required: true,
  },
  checkOut: {
    type: Number,
  },
  date: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isOtApproved: {
    type: Boolean,
    default: false,
  },
  isPermissionApproved: {
    type: Boolean,
    default: false,
  },
  isLateApproved: {
    type: Boolean,
    default: false,
  },
  overAllLoginTime: {
    type: Number,
    default: 0,
  },
}, { timestamps: true, collection: "attendance" });

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = {Attendance};
