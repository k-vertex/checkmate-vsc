const db = require("../config/dbConnector");
const key = require("../config/securityConfig");

//임베디드에서 오는 출결처리랑 선생님들이 웹이나 앱에서 해주는 출결 처리를 한 라우팅으로 할 건지 아니면 다른 라우팅으로 처리할건지 고민

exports.attend = (req, res) => {
    const { deviceToken, attendance } = req.body;
    const date = formatDate(new Date());
    const query = "INSERT INTO attendance VALUES((SELECT student_id FROM attendance WHERE device_token=?), ?, ?);";
    db.query(query, [deviceToken, date, attendance], (err, results) => {
        if(err) {
            if(err.code == "ER_DUP_ENTRY") { 
                if(attendance == 1) { //이미 출석을 찍은 경우
                }
                else
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