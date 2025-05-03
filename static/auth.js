let registerForm = document.querySelector(".register form")

registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let data = new FormData(e.target)
    let login = data.get("login")
    let password = data.get("password")
    let passwordR = data.get("passwordR")
    if (password != passwordR) {
        alert("Ty typiy paroly ne odnakovi")
        return
    }
    if (password.length < 2 || login.length < 2) {
        alert("login or parrword too korotki, write bilshi")
        return
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ login, password })
    }).then((res) => res.json()).then(res => {
        if (res.status = 302) window.location("/login");
        return res.json();
    }).then((res) => res.json()).then(res => {
        console.log(res)
    })
});

