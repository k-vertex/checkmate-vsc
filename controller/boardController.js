const db = require("../config/dbConnector");
const formatDate = require("../util/formatDate");

exports.getAllArticle = (req, res) => {
    const { lastBoardID } = req.body;
    const addtionalQuery = lastBoardID != null ? `(SELECT DISTINCT date FROM board WHERE board_id=${lastBoardID}) AND board_id < ${lastBoardID}` : "";
    const query = `SELECT * FROM board b LEFT OUTER JOIN (SELECT student_id, name FROM student) s USING (student_id) ${addtionalQuery} ORDER BY date DESC LIMIT 15`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("게시글 가져오는 중 오류:", err);
            res.status(500).send("오류");
        } 
        else if (results.length > 0) {
            res.status(200).json(results);
        } 
        else {
            res.status(200).send("더 이상 게시글이 없음");
        }
    });
}

exports.getArticle = (req, res) => {
    const { articleID } = req.body;
    const query = "SELECT * FROM board b LEFT OUTER JOIN (SELECT student_id, name FROM student) s USING (student_id) WHERE board_id = ?;";
    db.query(query, [articleID], (err, results) => {
        if (err) {
            console.error("게시글 가져오는 중 오류:", err);
            res.status(500).send("오류");
        } 
        else if (results.length > 0) {
            rse.status(200).json(results);
        } 
        else {
            res.status(200).send("해당 게시글이 없음");
        }
    });
}

exports.getArticleComment = (req, res) => {
    const { articleID } = req.body;
    const query = "SELECT * FROM board_comment WHERE board_id=?";
    db.query(query, [articleID], (err, results) => {
        if (err) {
            console.error("게시글 가져오는 중 오류:", err);
            res.status(500).send("오류");
        } 
        else if (results.length > 0) {
            rse.status(200).json(results);
        } 
        else {
            res.status(200).send("해당 게시글에 댓글이 없음");
        }
    });
}

exports.addArticleComment = (req, res) => {
    const { articleID, writerID, content, userType } = req.body;
    const studentID = userType == "학생" ? writerID : null;
    const managerID = userType == "관계자" ? writerID : null;
    const date = formatDateTime(new Date());
    const query = "INSERT INTO board_comment(board_id, student_id, manager_id, content, date) VALUES (?, ?, ?, ?, ?);";
    db.query(query, [articleID, studentID, managerID, content, date], (err, results) => {
        if (err) {
            console.error("게시글 가져오는 중 오류:", err);
            res.status(500).send("오류");
        } 
        else {
            res.status(200).send("성공");
        }
    });
}