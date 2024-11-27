const db = require("../config/dbConnector");

exports.register = (req, res) => { //프로토타입이기에 학원 이름은 제외
    const { name, rrn, id, password, userType } = req.body;
    if(name == null || rrn == null || id == null || password == null || userType == null)
        return;
    let user;
    if(userType == "학생")
        user = "student";
    else
        user = "parent"
    const query = `UPDATE ${user} SET id=?, password=? WHERE ${user}_id=(SELECT ${user}_id FROM (SELECT ${user}_id FROM ${user} WHERE name=? AND rrn=?) AS tmp)`;
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
};