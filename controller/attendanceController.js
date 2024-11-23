const db = require("../config/dbConnector");
const key = require("../config/securityConfig");

exports.setDeviceAttendance = (req, res) => {
    const { deviceToken, attendance, embededKey } = req.body;
    if(embededKey == key)
        attend(deviceToken, attendance);
}

exports.setManualAttendance = (req, res) => {
    const { deviceToken, attendance, id = "NULL", password = "NULL" } = req.body;
    if(id == "NULL" || password == "NULL")
        return;
    attend(deviceToken, attendance);
}

function attend(deviceToken, attendance) {
    const date = formatDate(new Date());
    const query = "INSERT INTO attendance VALUES((SELECT student_id FROM attendance WHERE device_token=?), ?, ?);";
    db.query(query, [deviceToken, date, attendance], (err, results) => {
        if(err) {
            if (err.code == "ER_DUP_ENTRY") { 
                updateAttendance(deviceToken, date, attendance);
            }   
            else {
                console.error("출석 실패:", err);
                res.status(500).send("서버 오류");
            }
        }
    });
}

function updateAttendance(deviceToken, date, attendance) {
    const query = "UPDATE attendance SET checked=? WHERE student_id=(SELECT student_id FROM attendance WHERE device_token=?) AND date=?";
    db.query(query, [attendance, deviceToken, date], (err, results) => {
        if(err) {
            console.error("출석 업데이트 실패:", err);
            res.status(500).send("서버 오류");
        }
    });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}