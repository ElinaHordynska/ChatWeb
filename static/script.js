let socket = io()

document.querySelector(".form button").addEventListener("click", function () {
    let input = document.querySelector(".form input")
    console.log(input.value)
    let text = input.value
    input.value = ""
    socket.emit("message", JSON.stringify({ name: "user", text }))
})

socket.on("update", function (data) {
    console.log(JSON.parse(data));
    let main = document.querySelector("main");
    main.innerHTML = JSON.parse(data)
        .map(
            (message) => {
                message = JSON.parse(message)
                return `<div class="message">${message.name}: ${message.text}</div>`
            }
        )
        .join("");
});