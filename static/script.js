let socket = io()

let cookies = document.cookie?.split("; ")
let login = cookies.find(el => el.startsWith("login")).split("=")[1]
let id = cookies.find(el => el.startsWith("id")).split("=")[1]
console.log(id)

document.querySelector(".form button").addEventListener("click", function () {
    let input = document.querySelector(".form input")
    console.log(input.value)
    let text = input.value
    input.value = ""
    socket.emit("message", JSON.stringify({ name: id, text }))
})

socket.on("update", function (data) {
    console.log(JSON.parse(data));
    let main = document.querySelector("main");
    main.innerHTML = JSON.parse(data)
        .map(
            (message) => {
                return `<div class="message">${message.name}: ${message.text}</div>`
            }
        )
        .join("");
});

function logout(){
    document.cookie = "token="
    window.location.assign("/login")
}