const db = require("../config/dbConnector");
const formatDate = require("../util/formatDate");

exports.uploadBoard = (req, res) => {
    const { title, content, writer, userType } = req.body;
    if(userType == null)
        return;
    const studentID = userType == "학생" ? writer : null;
    const managerID = userType == "관계자" ? writer : null;
    const date = formatDateTime(new Date());
    const query = "INSERT INTO board(student_id, manager_id, title, content, date) VALUES (?, ?, ?, ?, ?);";
    db.query(query, [studentID, managerID, title, content, date], (err, results) => {
        if(err) {
            console.error("게시글 업로드 오류:", err);
            res.status(500).send("게시글 작성 실패");
        } 
    });
    res.status(200).send("게시글 작성 완료");
};