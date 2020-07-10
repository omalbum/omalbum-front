/*
// https://stackoverflow.com/a/25490531
function read_cookie(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}
*/

function is_logged_in() {
    expiration = localStorage.getItem('expiration')
    if(expiration) return Date.parse(expiration) > Date.now();
    return false;
}


function login(user_name, password) {
    return login_request({ "user_name": user_name, "password": password }).then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.User));
        window.location.href = "index.html";
    }).catch(err => {
        notify("notification urgent", "Login fallido", html_escape(err.code));
    });
}

function login_event(form) {
    data = extract_data(form.closest("form"));
    return login(data["user_name"], data["password"]);
}

function user() {
    if(is_logged_in()){
        return JSON.parse(localStorage.getItem("user"))
    }
    else return null;
}

function is_admin(){
	return user()["is_admin"];
}

function logout_update() {
    localStorage.setItem("expiration", "");
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
    for(elem of document.getElementsByClassName("logged-in")) {
        elem.style.display = "none";
    }
    for(elem of document.getElementsByClassName("logged-out")) {
        elem.style.display = "block";
    }
}

function login_update() {
    my_user = user();
    fill_with("fill-user_name", () => my_user["user_name"]);
    fill_with("fill-name", () => my_user["name"]);
    fill_with("fill-last_name", () => my_user["last_name"]);
    fill_with("fill-user_id", () => my_user["user_id"]);
    fill_with("fill-email", () => my_user["email"]);
    for(elem of document.getElementsByClassName("logged-out")) {
        elem.style.display = "none";
    }
    for(elem of document.getElementsByClassName("logged-in")) {
        elem.style.display = "block";
    }
}
