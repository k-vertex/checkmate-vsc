const db = require("../config/dbConnector");

exports.register = (req, res) => { //프로토타입이기에 학원 이름은 제외
    const { name, rrn, id, password, userType } = req.body;
    if(name == null || rrn == null || id == null || password == null || userType == null)
        return;
    if(userType == "학생")
        registerStudent(res, id, password, name, rrn);
    else
        registerParent(res, id, password, name, rrn);
}


function registerStudent(res, id, password, name, rrn) {
    const query = "UPDATE student SET id=?, password=?, device_token=? WHERE student_id=(SELECT student_id FROM (SELECT student_id FROM student WHERE name=? AND rrn=?) AS tmp)";
    const deviceToken = createDeviceToken();
    db.query(query, [id, password, deviceToken, name, rrn], (err, results) => {
        if (err) {
            console.error("회원가입 오류 발생:", err);
            res.status(500).send("서버 오류");
        } 
        else {
            console.log(results.changedRows);
            if(results.changedRows == 0) 
                res.status(500).send("정보가 일치하지 않습니다.");
            else
                res.status(200).send("회원가입 성공");
           
        }
    });
}

function registerParent(res, id, password, name, rrn) {
    const query = "UPDATE parent SET id=?, password=? WHERE parent_id=(SELECT parent_id FROM (SELECT parent_id FROM parent WHERE name=? AND rrn=?) AS tmp)";
    db.query(query, [id, password, name, rrn], (err, results) => {
        if (err) {
            console.error("회원가입 오류 발생:", err);
            res.status(500).send("서버 오류");
        } 
        else {
            console.log(results.changedRows);
            if(results.changedRows == 0) 
                res.status(500).send("정보가 일치하지 않습니다.");
            else
                res.status(200).send("회원가입 성공");
           
        }
    });
}

function createDeviceToken() {
    const character = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let deviceToken = "";
    for(let i = 0; i < 12; i++) {
        deviceToken += character[parseInt(Math.random() * character.length)];
    }
    return deviceToken;
}