const {Attendance} = require("./src/models/attendance.model")
const{ Employee} = require("./src/models/employee.model")
const { EmployeePayroll } = require("./src/models/employeePayroll.model");
const { Payroll } = require("./src/models/employeeSalaryDetails.model");
const { CompanyWorkingDays } = require("./src/models/workingDay.model");

const employeePayroll = async(req, res)=>{

    // // try {
    // //     // const data = req.body;
    // //     // console.log(data);
    // //     const attendance = await Attendance.find();
    // //     res.status(201).json({
    // //       message: "Attendance Created Successfully",
    // //       data: attendance,
    // //     });
    // //   } catch (err) {
    // //     res.status(500).json({ message: "Failed to create attendance", error: err });
    // //   }

    // try {
      
    //   const data = req.body;
    //   const employee = await EmployeePayroll.create(data)
    //   res.status(201).json({
    //     message: "Employee created",
    //     data: employee
    //   })
    // } catch (error) {
    //   res.status(500).json({message: "Failed to create", error: error})
  // }
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
          unapproved_leave: 0,
    };
        
    const employee_id = "EMP1001";
    

    const employeeAttendance = await Attendance.find({ employee_id });

        for (let i = 0; i < employeeAttendance.length; i++) {
            let data = employeeAttendance[i];

            if (data.isApproved=== true) {
                if (data.status === "present") EmployeeData.present++;
                else if (data.status === "casual-leave") EmployeeData.casual_leave_taken++;
                else if (data.status === "sick-leave") EmployeeData.sick_leave_taken++;
                else if (data.status === "comp-off") EmployeeData.comp_off_taken++;
                else if (data.status === "permission") EmployeeData.permission_taken++;
                else if (data.status === "wfh") EmployeeData.wfh++;
                else if (data.status === "od") EmployeeData.od++;
            } else {
                EmployeeData.unapproved_leave++;
            }
          
          if (data.status === "holiday") EmployeeData.holiday++;
        }

    console.log(EmployeeData);

    const SalaryDetails = await Payroll.findOne({ employee_id });
    const EmployeeDetails = await Employee.findOne({ empId: employee_id });
    const EmployeePayRoll = await EmployeePayroll.findOne({ employee_id });
    // console.log(EmployeePayRoll);
    
    // console.log(SalaryDetails);

    const Grosssalary = SalaryDetails.payrollConfig.basic + SalaryDetails.payrollConfig.hra + SalaryDetails.payrollConfig.conveyance;
    const totalSalaryDays = (EmployeeData.casual_leave_taken + EmployeeData.sick_leave_taken + EmployeeData.present + EmployeeData.permission_taken + EmployeeData.od + EmployeeData.holiday + EmployeeData.comp_off_taken + EmployeeData.wfh)
    const totalWorkingCalculation = await CompanyWorkingDays.findOne({
      "workingDay.department_id": EmployeeDetails.department_id,
    });
    
    const totalCompanyWorkingDays = totalWorkingCalculation.workingDay.totalDays;
    const totalEmployeeWorkingDays = Math.floor((totalSalaryDays/totalCompanyWorkingDays)*Grosssalary)
    // console.log(totalEmployeeWorkingDays);

    const pfDeduction = EmployeePayRoll.isPFIncluded ? SalaryDetails.payrollConfig.pf : 0;
    const esiDeduction = EmployeePayRoll.isESIIncluded ? SalaryDetails.payrollConfig.esi : 0;

    const netSalary = totalEmployeeWorkingDays - (pfDeduction + esiDeduction);

    console.log(netSalary);


    const employeePayBill = {
      employee_id: employee_id,
      gross_salary: Grosssalary,
      pro_rated_gross_salary: totalEmployeeWorkingDays,
      deductions: {
        pf: SalaryDetails.payrollConfig.pf || 0,
        esi: SalaryDetails.payrollConfig.esi || 0,
        total_deductions:
          SalaryDetails.payrollConfig.pf + SalaryDetails.payrollConfig.esi,
      },
      net_salary: netSalary,
      leave_utilization: {
        paid_days: totalSalaryDays,
        // unpaid_days: EmployeeData.unapproved_leave,
        details: {
          present: EmployeeData.present,
          casual_leave: EmployeeData.casual_leave_taken,
          sick_leave: EmployeeData.sick_leave_taken,
          comp_off: EmployeeData.comp_off_taken,
          permission: EmployeeData.permission_taken,
          wfh: EmployeeData.wfh,
          od: EmployeeData.od,
          holiday:EmployeeData.holiday,
          // extra_casual_leave: 1,
          // extra_sick_leave: 1,
          unapproved_leave: EmployeeData.unapproved_leave,
        },
      },
    };

      return res.json({ message: "Message sent successfully", employeePayBill });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    employeePayroll
}