const db = require("../config/dbConnector");

exports.getArticle = (req, res) => {
    const { lastBoardID } = req.body;
    const addtionalQuery = lastBoardID != null ? `(SELECT DISTINCT date FROM board WHERE board_id=${lastBoardID}) AND board_id < ${lastBoardID}` : "";
    const query = `SELECT * FROM board b LEFT OUTER JOIN (SELECT student_id, name FROM student) s USING (student_id) ${addtionalQuery} ORDER BY date DESC LIMIT 15`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("게시글 가져오는 중 오류:", err);
            res.status(500).send("오류");
        } 
        else if (results.length > 0) {
            rse.status(200).json(results);
        } 
        else {
            res.status(200).send("더 이상 게시글이 없음");
        }
    });
};