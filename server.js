require("dotenv").config()
let db = require("./db")
let http = require("http")
let path = require("path")
let fs = require("fs")
let { Server } = require("socket.io")
let bcrypt = require("bcrypt")

let pathToIndex = path.join(__dirname, "static", "index.html")
let index = fs.readFileSync(pathToIndex, "utf-8")

let pathToStyle = path.join(__dirname, "static", "style.css")
let style = fs.readFileSync(pathToStyle, "utf-8")

let pathToScript = path.join(__dirname, "static", "script.js")
let script = fs.readFileSync(pathToScript, "utf-8")

let pathToRegister = path.join(__dirname, "static", "register.html")
let register = fs.readFileSync(pathToRegister, "utf-8")

let pathToLogin = path.join(__dirname, "static", "login.html")
let loginPage = fs.readFileSync(pathToLogin, "utf-8")

let pathToAuth = path.join(__dirname, "static", "auth.js")
let auth = fs.readFileSync(pathToAuth, "utf-8")

let ser = http.createServer((req, res) => {
    switch (req.url) {
        case "/":
            res.writeHead(200, { "content-type": "text/html" })
            res.end(index)
            break;
        case "/register":
            res.writeHead(200, { "content-type": "text/html" })
            res.end(register)
            break;
        case "/login":
            res.writeHead(200, { "content-type": "text/html" })
            res.end(loginPage)
            break;
        case "/style.css":
            res.writeHead(200, { "content-type": "text/css" })
            res.end(style)
            break;
        case "/script.js":
            res.writeHead(200, { "content-type": "text/js" })
            res.end(script)
            break;
        case "/auth.js":
            res.writeHead(200, { "content-type": "text/js" })
            res.end(auth)
            break;
        case "/api/register":
            let data = ""
            req.on("data", chunk => data += chunk)
            req.on("end", async () => {
                data = JSON.parse(data)
                console.log(data)
                let hash = await bcrypt.hash(data.password, 10)
                console.log(hash)
                console.log(await bcrypt.compare(data.password, hash))
                if(await db.checkExists(data.login).catch(err=>console.log(err))){
                    res.end("User exist")
                    return
                }
                await db.addUser(data.login, hash).catch(err=>console.log(err))
                res.writeHead(302, { "location": "/login" })
                res.end(JSON.stringify({ satus: "ok" }))
            })
            break;
        default:
            res.writeHead(404, { "content-type": "text/html" })
            res.end("<h1>404 not found</h1>")
    }
}).listen(3000, () => console.log("Server is on!"))

let io = new Server(ser);

io.on("connection", async function (s) {
    console.log(s.id)
    let messages = await db.getMessages()
    messages = messages.map(m => ({ name: m.login, text: m.content }))
    io.emit("update", JSON.stringify(messages))
    s.on("message", (data) => {
        console.log(data)
        message.push(data)
        s.emit("update", JSON.stringify(message))
    })
})