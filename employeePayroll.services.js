const { Attendance } = require("./src/models/attendance.model");
const { Employee } = require("./src/models/employee.model");
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
      late: 0,
      unPaid: 0,
      unapproved_leave: 0,
      halfDay: 0,
    };

    const employee_id = "EMP1001";

    let totalOverTime = 0;


    const employeeAttendance = await Attendance.find({ employee_id });
    const EmployeePayRoll = await EmployeePayroll.findOne({ employee_id });

    console.log("Before", EmployeePayRoll);
    console.log("Before", EmployeeData);

    for (let data of employeeAttendance) {
      if (data.isApproved) {
          let overTime = 0;
        switch (data.status) {
          case "present":
            EmployeeData.present++;
             if (data.isOtApproved) {
               overTime = data.checkOut - data.checkIn;
               if (overTime > 28800000) totalOverTime += overTime;
             }
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
             if (data.isOtApproved) {
               overTime = data.checkOut - data.checkIn;
               if (overTime > 28800000) totalOverTime += overTime;
             }
            break;
          case "od":
            EmployeeData.od++;
             if (data.isOtApproved) {
               overTime = data.checkOut - data.checkIn;
               if (overTime > 28800000) totalOverTime += overTime;
             }
            break;
        }

        if (data.isLateApproved === false) {
          EmployeeData.late++;

          if (EmployeePayRoll.late > 0) {
            EmployeePayRoll.late--;
          } else if (EmployeePayRoll.permission > 0) {
            EmployeePayRoll.permission--;
          }
          else if (EmployeePayRoll.permission === 0 && EmployeePayRoll.late === 0 && EmployeeData.halfDay < 1) {
            EmployeeData.halfDay++
             if (EmployeeData.present > 0) {
               EmployeeData.present--;
             }
            }
          else {
            EmployeeData.unPaid++;
            if (EmployeeData.present > 0) {
              EmployeeData.present--;
            }
          }
        }

        if (data.isPermissionApproved === true) {
          if (EmployeePayRoll.permission > 0) {
            EmployeePayRoll.permission--;
          } else {
            EmployeeData.unPaid++;
            if (EmployeeData.present > 0) {
              EmployeeData.present--;
            }
          }
        }
      } else {
        EmployeeData.unapproved_leave++;
      }

      if (data.status === "holiday") EmployeeData.holiday++;
    }

    console.log("Middle", EmployeeData);

    const SalaryDetails = await Payroll.findOne({ employee_id });
    const EmployeeDetails = await Employee.findOne({ empId: employee_id });

    if (!EmployeePayRoll) {
      return res.status(404).json({ message: "Employee Payroll not found" });
    }

    if (EmployeeData.sick_leave_taken >= EmployeePayRoll.sickLeave) {
      const count = EmployeeData.sick_leave_taken - EmployeePayRoll.sickLeave;
      EmployeePayRoll.sickLeave = 0;

      if (count > 0 && count <= EmployeePayRoll.casualLeave) {
        EmployeePayRoll.casualLeave -= count;
      } else if (count > EmployeePayRoll.casualLeave) {
        EmployeePayRoll.casualLeave = 0;
      }
    } else {
      EmployeePayRoll.sickLeave -= EmployeeData.sick_leave_taken;
    }

    if (EmployeeData.casual_leave_taken >= EmployeePayRoll.casualLeave) {
      const count =
        EmployeeData.casual_leave_taken - EmployeePayRoll.casualLeave;
      EmployeePayRoll.casualLeave = 0;

      if (count > 0 && count <= EmployeePayRoll.sickLeave) {
        EmployeePayRoll.sickLeave -= count;

      } else if (count > EmployeePayRoll.sickLeave) {
        EmployeePayRoll.sickLeave = 0;
      }
    } else {
      EmployeePayRoll.casualLeave -= EmployeeData.casual_leave_taken;
    }




    if (!SalaryDetails || !SalaryDetails.payrollConfig) {
      return res.status(400).json({ message: "Salary details missing" });
    }
    console.log("sickLeave", EmployeeData.sick_leave_taken);

        const basic =
          (EmployeePayRoll.grossSalary * SalaryDetails.payrollConfig.basic) /
          100;
        const hra = (basic * 75) / 100;
        const conveyance = (EmployeePayRoll.grossSalary * 10) / 100;
        const pf = (basic * SalaryDetails.payrollConfig.pf) / 100;
        const esi =
          (EmployeePayRoll.grossSalary * SalaryDetails.payrollConfig.esi) / 100;


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


    let totalEmployeeWorkingDays = Math.floor(
      (totalSalaryDays / totalCompanyWorkingDays) * EmployeePayRoll.grossSalary
    );
  let deduction = Math.round(
    EmployeePayRoll.grossSalary / employeeAttendance.length
  );

if (EmployeeData.halfDay > 0) {
  totalEmployeeWorkingDays = Math.round(
    totalEmployeeWorkingDays + deduction / 2
  );
  EmployeeData.halfDay--;
}


    const pfDeduction = EmployeePayRoll.isPFIncluded
      ? SalaryDetails.payrollConfig.pf || 0
      : 0;
    const esiDeduction = EmployeePayRoll.isESIIncluded
      ? SalaryDetails.payrollConfig.esi || 0
      : 0;

    let netSalary = totalEmployeeWorkingDays - (pf + esi);
 

        let overTime = totalOverTime > 0 ? totalOverTime / 3600000 : 0;
        let roundedOverTime = Math.round(overTime);

      const overTimeSalary =
        EmployeePayRoll.overTimePayPerHour * roundedOverTime;


    console.log(netSalary);

    const employeePayBill = {
      employee_id,
      gross_salary: EmployeePayRoll.grossSalary,
      basic_salary: basic,
      hra: hra,
      conveyance: conveyance,
      beforeDeductionSalary: totalEmployeeWorkingDays,
      deductions: {
        pf: pf,
        esi: esi,
        total_deductions: pf + esi,
      },
      net_salary: netSalary,
      overTimeSalary: overTimeSalary,
      leave_utilization: {
        paid_days: totalSalaryDays,
        details: { ...EmployeeData, overTime: roundedOverTime, unPaidSalaryDeduction: deduction*EmployeeData.unPaid, unApprovedSalaryDeduction : deduction * EmployeeData.unapproved_leave, halfDaySalaryDeduction : Math.round(((deduction)*EmployeeData.halfDay)/2)},
      },
    };

    console.log("After", EmployeePayRoll);
    console.log("After", EmployeeData);

    return res.json({ message: "Message sent successfully", employeePayBill });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  employeePayroll,
};
