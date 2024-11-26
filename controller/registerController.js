const db = require("../config/dbConnector");

exports.register = (req, res) => { //프로토타입이기에 학원 이름은 제외
    const { name, rrn, id, password, userType } = req.body;
    if(name == null || rrn == null || id == null || password == null || userType == null)
        return;
    if(userType == "학생")
        userType = "student";
    else
        userType = "parent"
    const query = `UPDATE ${userType} SET id=?, password=? WHERE ${userType}_id=(SELECT ${userType}_id FROM ${userType} WHERE name=? AND rrn=?)`;
    db.query(query, [id, password], (err, results) => {
        if (err) {
            console.error("회원가입 오류 발생:", err);
            res.status(500).send("서버 오류");
        } 
        else {
            res.status(200).send("회원가입 성공");
        }
    });
};