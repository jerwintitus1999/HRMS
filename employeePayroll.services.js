const {Attendance} = require("./src/models/attendance.model")
const{ Employee} = require("./src/models/employee.model")
const {EmployeePayroll} = require("./src/models/employeePayroll.model")

const employeePayroll = async(req, res)=>{

    // try {
    //     // const data = req.body;
    //     // console.log(data);
    //     const attendance = await Attendance.find();
    //     res.status(201).json({
    //       message: "Attendance Created Successfully",
    //       data: attendance,
    //     });
    //   } catch (err) {
    //     res.status(500).json({ message: "Failed to create attendance", error: err });
    //   }

    try {
      
      const data = req.body;
      const employee = await EmployeePayroll.create(data)
      res.status(201).json({
        message: "Employee created",
        data: employee
      })
    } catch (error) {
      res.status(500).json({message: "Failed to create", error: error})
    }


}

module.exports = {
    employeePayroll
}