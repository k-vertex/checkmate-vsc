const db = require("../config/dbConnector");

exports.attend = (req, res) => {
    const { deviceToken } = req.body;

    console.log(deviceToken);

    res.send("성공");
}