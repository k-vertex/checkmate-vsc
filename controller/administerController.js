const db = require("../config/dbConnector");

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
                        item.attend = '출결 관리';
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
                        item.attend = null;
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
    let fid = req.params.fid || Math.floor(Math.random() * 10000);
    title_test = req.params.fid || null;
    title = title_test ? `${fid} 가족 구성원 추가하기` : `새로운 가족 추가하기`;
    res.render("addFamily", {fid : fid, title : title});
}

exports.addFamily = (req, res) => {
    const { fid, name, rrn, device_token, type } = req.body;

    let table = type === 'student' ? 'student' : 'parent';
    
    const query = `INSERT INTO ${table} (name, rrn, device_token, fid) VALUES (?, ?, ?, ?)`;

    db.query(query, [name, rrn, device_token, fid], (err, result) => {
        if (err) {
            console.error("데이터베이스 저장 오류:", err);
            res.status(500).json({ success: false, message: "저장 중 오류가 발생했습니다." });
        } else {
            res.json({ success: true });
        }
    });
};