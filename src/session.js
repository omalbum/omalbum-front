/*
// https://stackoverflow.com/a/25490531
function read_cookie(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}
*/

function do_logout() {
	logout_update();
}

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
    	clear_notifications();
    	setTimeout(function(){
    		var msg = err.message;
    		if (err.message == "incorrect Username or Password") {
    			msg = "Usuario o contraseña incorrecta";
    		}
        	notify("notification urgent", "Login fallido", html_escape(msg));
        }, 250);
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
    fill_with("fill-birth_date", () => get_album_date_format(my_user["birth_date"]));
    fill_with("fill-gender", () => my_user["gender"]);
    fill_with("fill-country", () => my_user["country"]);
    fill_with("fill-province", () => my_user["province"]);
    fill_with("fill-department", () => my_user["department"]);
    fill_with("fill-locality", () => my_user["location"]);
    fill_with("fill-school", () => my_user["school"]);
    fill_with("fill-school_year", () => my_user["school_year"] || "-");
    fill_with("fill-is_teacher", () => my_user["is_teacher"] ? "Sí" : "No");
    fill_with("fill-is_student", () => my_user["is_student"] ? "Sí" : "No");
    for(elem of document.getElementsByClassName("logged-out")) {
        elem.style.display = "none";
    }
    for(elem of document.getElementsByClassName("logged-in")) {
        elem.style.display = "block";
    }
}
