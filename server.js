const express = require("express");
const path = require("path");
const sessionConfig = require("./config/sessionConfig");
const loginRoutes = require("./routes/loginRoutes");
const administerRoutes = require("./routes/administerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const registerRoutes = require("./routes/registerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const shortFormRoutes = require("./routes/shortFormRoutes");
const boardRoutes = require("./routes/boardRoutes");

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(sessionConfig);
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use("/", loginRoutes);
app.use("/main", administerRoutes);
app.use("/attend", attendanceRoutes);
app.use("/register", registerRoutes);
app.use("/upload", uploadRoutes);
app.use("/video", shortFormRoutes);
app.use("/board", boardRoutes);

app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
})

