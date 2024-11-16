const db = require("../config/dbConfig");

exports.showLoginPage = (req, res) => {
    res.render("index");
};

exports.handleLogin = (req, res) => {
    const { id, password } = req.body;
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