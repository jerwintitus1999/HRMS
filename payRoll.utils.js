const calculateDays = (attendances=[],workingDay={} ,availableLeave=[],employeeConfig={}) => {

    if(attendances.length===0) return "No attendance available"

    if(Object.keys(employeeConfig).length===0) return "employee config is mandatory"

    if(Object.keys(workingDay).length===0) return "working days is mandatory"

    if(availableLeave.length===0) return "available leave is mandatory"

    let casualLeaveTaken = 0;
    let sickLeaveTaken = 0;
    let compOffTaken = 0;
    let unapprovedLeaveTaken = 0;
    let permissionTaken = 0;
    let availableCasualLeave = 0;
    let availableSickLeave = 0;
    let availableCompOff = 0;
    let availablePermission = 0;
    const { late:allowedLate, permission:allowedPermissions, sickLeave: allowedSickLeave, casualLeave: allowedCasualLeave } = employeeConfig
    const {totalDays, workingDays, leaveDays} = workingDay;

    for(const leave of availableLeave){
        if(leave.leaveType === "sick-leave"){
            availableSickLeave = leave.balance;
            continue;
        }
        if(leave.leaveType === "casual-leave"){
            availableCasualLeave = leave.balance;
            continue;
        }
        if(leave.leaveType === "comp-off"){
            availableCompOff = leave.balance;
            continue;
        }
        if(leave.leaveType === "permission"){
            availablePermission = leave.balance;
            continue;
        }
    };

    for(const attendance of attendances){
        if(attendance.status === "present"){
            continue;
        }
        if(attendance.status === "absent"){
            unapprovedLeaveTaken +=1;
            continue;
        }
        if(attendance.status === "sick-leave"){
            if(attendance.isSickLeaveApproved){
                sickLeaveTaken +=1;
            }else{
                unapprovedLeaveTaken +=1;
            }
            continue;
        }
        if(attendance.status === "casual-leave"){
            if(attendance.isCasualLeaveApproved){
                casualLeaveTaken +=1;
            }else{
                unapprovedLeaveTaken +=1;
            }
            continue;

        }
        if(attendance.status === "compOff"){
            if(attendance.isCompOffApproved){
                compOffTaken +=1;
            }else{
                unapprovedLeaveTaken +=1;
            }
            continue;
        }
        if(attendance.status === "wfh"){
            if(attendance.isWfhApproved){
                casualLeaveTaken +=1;
            }else{
                unapprovedLeaveTaken +=1;
            }
            continue;
        }
    }
}