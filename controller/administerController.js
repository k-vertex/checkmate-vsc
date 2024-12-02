const db = require("../config/dbConnector");

exports.showAdminPage = async (req, res) => {
    const student_query = "SELECT student_id, name, rrn, device_token, fid FROM student";
    const parent_query = "SELECT parent_id, name, rrn, fid FROM parent";
    
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

exports.showAdminPage2 = async (req, res, abc) => {
    const student_query = "SELECT student_id, name, rrn, device_token, fid FROM student WHERE fid = ?";
    const parent_query = "SELECT parent_id, name, rrn, fid FROM parent WHERE fid = ?";
    
    try {
        const students = await new Promise((resolve, reject) => {
            db.query(student_query, [abc], (err, result) => {
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
            db.query(parent_query, [abc], (err, result) => {
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

function getStudentsByFid(fid, callback) {
    db.query('SELECT name FROM student WHERE fid = ?', [fid], (error, results) => {
        if (error) {
            console.error('Error fetching students:', error);
            return callback(error);  
        }
        callback(null, results);  
    });
}

exports.addFamilyPage = (req, res) => {
    let fid = req.params.fid || Math.floor(Math.random() * 10000);  

    getStudentsByFid(fid, (error, students) => {
        if (error) {
            return res.status(500).send("서버 오류가 발생했습니다.");  
        }

        let title = '';
        
        if (students && students.length > 0) {
            const studentNames = students.map(student => student.name).join(", ");
            title = `${studentNames} 가족 구성원 추가하기`; 
        } else {
            title = "새로운 가족 추가하기";
        }

        res.render("addFamily", { fid: fid, title: title, students: students });
    });
};


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

exports.editStudentPage = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM student WHERE student_id = ?', [id], (err, results) => {
        if (err) {
            console.error('DB 쿼리 오류:', err);
            return res.status(500).send('서버 오류');
        }

        if (results.length === 0) {
            return res.status(404).send('해당 사용자를 찾을 수 없습니다.');
        }

        const person = results[0];
        person.type = '학생';
        res.render('editFamily', { person, id });  
    });
}

exports.editParentPage = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM parent WHERE parent_id = ?', [id], (err, results) => {
        if (err) {
            console.error('DB 쿼리 오류:', err);
            return res.status(500).send('서버 오류');
        }

        if (results.length === 0) {
            return res.status(404).send('해당 사용자를 찾을 수 없습니다.');
        }

        const person = results[0];
        person.type = '부모';
        res.render('editFamily', { person, id });  
    });
}

exports.editPeople = (req, res) => {
    const id = req.params.id;
    const {name, rrn, device_token, type } = req.body;
    const table = type === 'student' ? 'student' : 'parent';
    const rId = type === 'student' ? 'student_id' : 'parent_id';

    const query = `UPDATE ${table} SET name = ?, rrn = ?, device_token = ? WHERE ${rId} = ?`;

    db.query(query, [name, rrn, device_token, id], (err, result) => {
        if (err) {
            console.error("데이터베이스 저장 오류:", err);
            res.status(500).json({ success: false, message: "저장 중 오류가 발생했습니다." });
        } else {
            res.json({ success: true });
        }
    });
}

exports.deletePeople = (req, res) => {
    const id = req.params.id;
    const type = req.body.type;
    const table = type === 'student' ? 'student' : 'parent';
    const rId = type === 'student' ? 'student_id' : 'parent_id';

    console.log(id);
    console.log(type);

    const query = `DELETE FROM ${table} WHERE ${rId} = ?`

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("데이터베이스 삭제 오류:", err);
            res.status(500).json({ success: false, message: "삭제 중 오류가 발생했습니다." });
        } else {
            res.json({ success: true });
        }
    });
}

exports.search = (req, res) => {
    const name = req.query.name;
    const fidQuery = "SELECT fid FROM student WHERE name LIKE ?";

    db.query(fidQuery, [`%${name}%`], (err, results) => {
        if (err) {
            console.error("검색 중 오류 발생:", err);
            return res.status(500).send("서버 오류");
        }

        if (results.length === 0) {
            return res.send("학생을 찾을 수 없습니다.");
        }

        const fid = results[0].fid;

        this.showAdminPage2(req, res, fid);
    });
}