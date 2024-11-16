const db = require("../config/dbConfig");

exports.showAdminPage = async (req, res) => {
    const student_query = "SELECT name, rrn, device_token, fid FROM student";
    const parent_query = "SELECT name, rrn, device_token, fid FROM parent";
    
    try {
        const students = await new Promise((resolve, reject) => {
            db.query(student_query, (err, result) => {
                if (err) reject(err);
                else {
                    result.forEach(item => {
                        item.type = '학생';
                    })
                    resolve(result);
                }
            });
        });

        const parents = await new Promise((resolve, reject) => {
            db.query(parent_query, (err, result) => {
                if (err) reject(err);
                else {
                    result.forEach(item => {
                        item.type = '부모';
                    })
                    resolve(result);
                }
            });
        });
        
        const groupedData = {};
        [students, parents].forEach(dataArray => {
            dataArray.forEach(item => {
                const fid = item.fid;
                if (!groupedData[fid]) groupedData[fid] = [];
                groupedData[fid].push(item);
            });
        });

        res.render("administer", { groupedData: groupedData});
    } catch (err) {
        console.error("데이터베이스 쿼리 오류:", err);
        res.status(500).send("서버 오류 발생");
    }
};

exports.addFamilyPage = async (req, res) => {
    res.render("addFamily");
}