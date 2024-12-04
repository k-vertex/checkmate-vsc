const db = require("../config/dbConnector");
const key = require("../config/securityConfig");
const sendPushNotification = require("../FCMAppServer");
const { formatDate, formateTime } = require("../util/formatDate");
const moment = require('moment-timezone');

exports.setDeviceAttendance = (req, res) => {
    const { deviceToken, attendance, embededKey } = req.body;
    if(embededKey == key) {
        attend(res, deviceToken, attendance);
        sendAttedanceMessage(deviceToken, formateTime(new Date()));
    }
}

exports.setManualAttendance = (req, res) => {
    const { deviceToken, attendance, id = "NULL", password = "NULL" } = req.body;
    if(id == "NULL" || password == "NULL")
        return;
    attend(res, deviceToken, attendance);
}

exports.getAttendanceStatus = (req, res) => {
    const studentID  = req.query.studentID;
    const year = req.query.year;
    const month = req.query.month;
    if(studentID == null) {
        res.status(404).send("학생ID가 없음");
        return;
    }
    const date = new Date(`${year}-${month}-01`);
    const minDate = formatDate(date);
    date.setMonth(date.getMonth() + 1);
    const maxDate = formatDate(date);
    const query = "SELECT date, checked FROM attendance WHERE student_id=? AND date >= ? AND date < ?";
    db.query(query, [studentID, minDate, maxDate], (err, results) => {
        if(!err) {
            res.status(200).json(results);
        }
    });
}

const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month - 1, 1); 
    const totalDays = new Date(year, month, 0).getDate(); 

    for (let i = 1; i <= totalDays; i++) {
        const day = new Date(year, month - 1, i);
        const dayOfWeek = day.getDay();  
        days.push({
            date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
            dayOfWeek: dayOfWeek
        });
    }
    return days;
};

exports.getAttendanceStatus2 = (req, res) => {
    const studentID = req.params.studentID;
    const year = req.query.year || new Date().getFullYear(); 
    const month = req.query.month || new Date().getMonth() + 1;

    if (studentID == null) {
        res.status(404).send("학생ID가 없음");
        return;
    }

    const daysInMonth = getDaysInMonth(year, month);  

    const date = new Date(year, month - 1, 1);
    date.setHours(9, 0, 0, 0);  
    const minDate = formatDate(date);  
    date.setMonth(date.getMonth() + 1);  
    const maxDate = formatDate(date);


    const getNameQuery = "SELECT name FROM student WHERE student_id = ?";

    db.query(getNameQuery, [studentID], (err, nameResults) => {
        if (err) {
            res.status(500).send("데이터베이스 오류");
            return;
        }

        const studentName = nameResults[0] ? nameResults[0].name : '이름 없음';

        const query = "SELECT date, checked FROM attendance WHERE student_id=? AND date >= ? AND date < ?";

        db.query(query, [studentID, minDate, maxDate], (err, results) => {
            if (err) {
                res.status(500).send("데이터베이스 오류");
                return;
            }

            results = results.map(record => {
                record.date = moment(record.date).tz("Asia/Seoul").format("YYYY-MM-DD");
                return record;
            });

            console.log(results);
            
            res.render('attendance', {
                studentID: studentID,
                year: year,
                month: month,
                results: results,
                daysInMonth: daysInMonth,
                studentName: studentName, 
            });
        });
    });
};


exports.updateAttendanceStatus = (req, res) => {
    const studentID = req.params.studentID;
    const { year, month, day, status } = req.body;

    if (!studentID || !year || !month || !day || !status) {
        console.error("입력 값이 누락되었습니다:", req.body);
        return res.status(400).send("입력 값이 누락되었습니다.");
    }


    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const checked = status === "present" ? 1 : 0;

    const query = `UPDATE attendance SET checked = ? WHERE student_id = ? AND date = ?`;

    db.query(query, [checked, studentID, date], (err) => {
        if (err) {
            console.error("출석 상태 업데이트 실패:", err);
            return res.status(500).send("서버 오류");
        }
        res.redirect(`/attend/${studentID}`);
    });
};

function attend(res, deviceToken, attendance) {
    const date = formatDate(new Date());
    const query = "INSERT INTO attendance VALUES((SELECT student_id FROM student WHERE device_token=?), ?, ?);";
    db.query(query, [deviceToken, date, attendance], (err, results) => {
        if(err) {
            if (err.code == "ER_DUP_ENTRY") { 
                updateAttendance(res, deviceToken, date, attendance);
            }   
            else {
                console.error("출석 실패:", err);
                res.status(500).send("서버 오류");
            }
        }
    });
}

function updateAttendance(res, deviceToken, date, attendance) {
    const query = "UPDATE attendance SET checked=? WHERE student_id=(SELECT student_id FROM student WHERE device_token=?) AND date=?";
    db.query(query, [attendance, deviceToken, date], (err, results) => {
        if(err) {
            console.error("출석 업데이트 실패:", err);
            res.status(500).send("서버 오류");
        }
    });
}

function sendAttedanceMessage(deviceToken, time) {
    const query = "SELECT fid, fcm_token, s.name FROM parent p LEFT OUTER JOIN (SELECT name, fid FROM student WHERE device_token = ?) s USING(fid);";
    db.query(query, [deviceToken], (err, results) => {
        if(!err) {
            for(let i = 0; i < results.length; i++) {
                const result = results[i];
                token = result.fcm_token;
                const msg = `${result.name}님이 ${time}에 등원하였습니다.`;
                sendPushNotification("[ChekMate] 학원 등원", msg, token);
            }
        }
    });
}