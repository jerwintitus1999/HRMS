const {Attendance} = require("./src/models/attendance.model")
const{ Employee} = require("./src/models/employee.model")
const { EmployeePayroll } = require("./src/models/employeePayroll.model");
const { Payroll } = require("./src/models/employeeSalaryDetails.model");
const { CompanyWorkingDays } = require("./src/models/workingDay.model");

const employeePayroll = async (req, res) => {
  try {
    let EmployeeData = {
      present: 0,
      casual_leave_taken: 0,
      sick_leave_taken: 0,
      comp_off_taken: 0,
      permission_taken: 0,
      wfh: 0,
      od: 0,
      holiday: 0,
      unPaid: 0,
      unapproved_leave: 0,
    };

    const employee_id = "EMP1001";

    const employeeAttendance = await Attendance.find({ employee_id });

    for (let data of employeeAttendance) {
      if (data.isApproved) {
        switch (data.status) {
          case "present":
            EmployeeData.present++;
            break;
          case "casual-leave":
            EmployeeData.casual_leave_taken++;
            break;
          case "sick-leave":
            EmployeeData.sick_leave_taken++;
            break;
          case "comp-off":
            EmployeeData.comp_off_taken++;
            break;
          case "permission":
            EmployeeData.permission_taken++;
            break;
          case "wfh":
            EmployeeData.wfh++;
            break;
          case "od":
            EmployeeData.od++;
            break;
        }
      } else {
        EmployeeData.unapproved_leave++;
      }

      if (data.status === "holiday") EmployeeData.holiday++;
    }

    console.log("Before", EmployeeData);

    const SalaryDetails = await Payroll.findOne({ employee_id });
    const EmployeeDetails = await Employee.findOne({ empId: employee_id });
    const EmployeePayRoll = await EmployeePayroll.findOne({ employee_id });

    if (!EmployeePayRoll) {
      return res.status(404).json({ message: "Employee Payroll not found" });
    }

    console.log("Before", EmployeePayRoll);

    if (EmployeeData.sick_leave_taken >= EmployeePayRoll.sickLeave) {
      const leaveCount =
        EmployeeData.sick_leave_taken - EmployeePayRoll.sickLeave;
      EmployeeData.sick_leave_taken = leaveCount;
      EmployeePayRoll.sickLeave = 0;
      EmployeeData.unPaid += leaveCount;
    } else {
      EmployeePayRoll.sickLeave -= EmployeeData.sick_leave_taken;
    }

    console.log("After", EmployeePayRoll);
    console.log("After", EmployeeData);

    if (!SalaryDetails || !SalaryDetails.payrollConfig) {
      return res.status(400).json({ message: "Salary details missing" });
    }
console.log("sickLeave", EmployeeData.sick_leave_taken);

    const Grosssalary =
      SalaryDetails.payrollConfig.basic +
      SalaryDetails.payrollConfig.hra +
      SalaryDetails.payrollConfig.conveyance;

    const totalSalaryDays =
      EmployeeData.casual_leave_taken +
      EmployeeData.sick_leave_taken +
      EmployeeData.present +
      EmployeeData.permission_taken +
      EmployeeData.od +
      EmployeeData.holiday +
      EmployeeData.comp_off_taken +
      EmployeeData.wfh;

    const totalWorkingCalculation = await CompanyWorkingDays.findOne({
      "workingDay.department_id": EmployeeDetails.department_id,
    });

    if (
      !totalWorkingCalculation ||
      totalWorkingCalculation.workingDay.totalDays === 0
    ) {
      return res
        .status(400)
        .json({ message: "Total company working days not found or invalid" });
    }

    const totalCompanyWorkingDays =
      totalWorkingCalculation.workingDay.totalDays;

    const totalEmployeeWorkingDays = Math.floor(
      (totalSalaryDays / totalCompanyWorkingDays) * Grosssalary
    );

    const pfDeduction = EmployeePayRoll.isPFIncluded
      ? SalaryDetails.payrollConfig.pf || 0
      : 0;
    const esiDeduction = EmployeePayRoll.isESIIncluded
      ? SalaryDetails.payrollConfig.esi || 0
      : 0;

    const netSalary = totalEmployeeWorkingDays - (pfDeduction + esiDeduction);

    console.log(netSalary);

    const employeePayBill = {
      employee_id,
      gross_salary: Grosssalary,
      beforeDeduction: totalEmployeeWorkingDays,
      deductions: {
        pf: pfDeduction,
        esi: esiDeduction,
        total_deductions: pfDeduction + esiDeduction,
      },
      net_salary: netSalary,
      leave_utilization: {
        paid_days: totalSalaryDays,
        details: { ...EmployeeData },
      },
    };

    return res.json({ message: "Message sent successfully", employeePayBill });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
    employeePayroll
}