const db = require("../config/dbConnector");

exports.showLoginPage = (req, res) => {
    res.render("index");
};

exports.handleLogin = (req, res) => {
    const { id, password, userType, fcmToken } = req.body;
    if(id == null || password == null || userType == null)
        return;
    if(userType == "관계자")
        loginAdmin(res, id, password);
    else if(userType == "학생")
        loginStudent(res, id, password, fcmToken);
    else if(userType == "학부모")
        loginParent(res, id, password, fcmToken);
};

exports.isAuthenticated = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    res.redirect("/");
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("세션 종료 중 오류 발생:", err);
            return res.status(500).send("서버 오류");
        }
        res.sendStatus(200); 
    });
}

function loginAdmin(res, id, password) {
    const query = "SELECT * FROM manager WHERE id = ? AND password = ?";
    db.query(query, [id, password], (err, results) => {
        if (err) {
            console.error("로그인 중 오류 발생:", err);
            res.status(500).send("서버 오류");
        } else if (results.length > 0) {
            req.session.loggedIn = true;
            res.redirect("/main");
        } else {
            res.send("아이디 또는 비밀번호가 올바르지 않습니다");
        }
    });
}

function loginStudent(res, id, password, fcmToken) {
    let query = "SELECT student_id, device_token, fid FROM student WHERE id=? AND password=?";
    db.query(query, [id, password], (err, results) => {
        if(err) {
            console.error("로그인 중 오류 발생:", err);
            res.status(500).send("서버 오류");
        } 
        else if (results.length > 0) {
            res.status(200).json(results);
            console.log(results);
            query = "UPDATE student SET fcm_token=? WHERE student_id=?"
            db.query(query, [fcmToken, results[0].student_id], (err, results) => {
                if(err) {
                    console.error("deviceToken 삽입 중 오류", err);
                }
            });
        } 
        else {
            res.send("아이디 또는 비밀번호가 올바르지 않습니다");
        }
    });
}

function loginParent(res, id, password, fcmToken) {
    let query = "SELECT parent_id, fid FROM parent WHERE id=? AND password=?";
    db.query(query, [id, password], (err, results) => {
        if (err) {
            console.error("로그인 중 오류 발생:", err);
            res.status(500).send("서버 오류");
        } 
        else if (results.length > 0) {
            res.status(200).json(results);
            query = "UPDATE parent SET fcm_token=? WHERE sparent_id=?"
            db.query(query, [fcmToken, results.parent_id], (err, results) => {
                if(err) {
                    console.error("deviceToken 삽입 중 오류", err);
                }
            });
        } 
        else {
            res.send("아이디 또는 비밀번호가 올바르지 않습니다");
        }
    });
}