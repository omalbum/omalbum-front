var host = "http://localhost:8080/";

function update_preview(button) {
    previewer = document.getElementById("preview");
    previewed = document.getElementById(button.getAttribute("for"));
    previewer.innerHTML = previewed.value;
    MathJax.typeset();
}

// https://stackoverflow.com/a/24468752
function get_request(endpoint, payload, authorize, method) {
    return new Promise (
        function(callback, fail) {
            var xhr = new XMLHttpRequest();
            if(method=="GET") {
                var url = host
                    + endpoint
                    + "?data="
                    + encodeURIComponent(JSON.stringify(payload));
            } else {
                url = host + endpoint;
            }
            xhr.open(method, url, true);
            if(method != "GET") {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            if(authorize && is_logged_in()) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem('token'));
            }
            xhr.onreadystatechange = function () {
                if (200 <= xhr.status && xhr.status < 300) {
                    console.log(xhr.responseText);
                    var json = JSON.parse(xhr.responseText);
                    callback(json);
                } else {
                    console.log("request failed")
                    console.log(url)
                    console.log(xhr.readyState)
                    console.log(xhr.status)
                    fail(undefined);
                }
            };
            if(method == "GET") {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(payload));
            }
        }
    );
}

// https://stackoverflow.com/a/25490531
function read_cookie(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function get_problems() {
    return post_request("/api/v1/problems/all", {});
}

function user() {

}

function login_or_profile() {
    if(is_logged_in()) {
        var user = JSON.parse(localStorage.getItem('user'));
        document.getElementsByTagName("nav")[0].innerHTML
            += `<a href="profile.html">profile<span class="username">(${user.user_name})</span></a>
            <a href="index.html" onclick="logout();">logout</a>`
    } else {
        document.getElementsByTagName("nav")[0].innerHTML
            += `<a href="login.html">login</a><a href="register.html">register</a>`
    }
}

function logout() {
    localStorage.setItem("expiration", "");
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
}

function problem_html(p) {
    if(p.status == "success") icon = "done";
    if(p.status == "star") icon = "star";
    if(p.status == "failure") icon = "close";
    if(p.status == "new") icon = "play_arrow";

    if(p.status == "success") css_class = "success";
    if(p.status == "star") css_class = "success";
    if(p.status == "failure") css_class = "failure";
    if(p.status == "new") css_class = "normal";
    return `
    <a class="problem ${css_class}" href="problems?id=${p.id}">
        <p class="code">${p.id}</p>
        <i class="material-icons problem-icon">${icon}</i>
        <p>${p.tries} intento${p!=1 ? "s" : ""}</p>
        <p class="date">${p.deadline}</p>
    </a>
    `
}

function insert_problems(problems) {
    for(p of problems) {
        html = problem_html(p);
        document.getElementById("problem-list").innerHTML += html
    }
}

function fill_with(class_name, action) {
    for(e of document.getElementsByClassName(class_name)) {
        e.innerHTML = action(e);
    }
}

function extract_data(form) {
    var data = {};
    for(elem of Array.from(form.getElementsByTagName("input")).concat(Array.from(form.getElementsByClassName("input")))) {
        if(elem.name) {
            if(elem.type == "checkbox") {
                value = elem.checked;
            } else {
                value = elem.value;
            }
            data[elem.name] = value
        }
    }
    return data;
}

function init() {
    console.log("init");
    login_or_profile();
    if(is_logged_in()) {
        var user = JSON.parse(localStorage.getItem('user'));
        fill_with("fill-user_name", () => user.user_name);
        fill_with("fill-name", () => user.name);
        fill_with("fill-last_name", () => user.last_name);
        fill_with("fill-user_id", () => user.user_id);
        fill_with("fill-email", () => user.email);
    }
    ele = document.getElementById("province");
    if(ele) {
        for(k in locations) {
            ele.innerHTML += `<option>${k}</option>`
        }
        loc = document.getElementById("department");
        for(k in locations) {
            for(j of locations[k]) {
                loc.innerHTML += `<option>${j}</option>`
            }
        }
    }
}

function reset_departments() {
    console.log("reset departamentos");
    loc = document.getElementById("department");
    tag = document.getElementsByName("province")[0];
    console.log(tag.value);
    loc.innerHTML = ""
    for(j of locations[tag.value]) {
        loc.innerHTML += `<option>${j}</option>`
    }
}

function is_logged_in() {
    expiration = localStorage.getItem('expiration')
    if(expiration) return Date.parse(expiration) > Date.now();
    return false;
}

function register(form) {
    data = extract_data(form.closest("form"));
    console.log("DATA: " + JSON.stringify(data));
    get_request("api/v1/register", data, false, "POST").then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.User));
        console.log(token);
    });
}

function login(form) {
    data = extract_data(form.closest("form"));
    get_request("api/v1/auth/login", data, false, "POST").then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.User));
        window.location.href = "index.html";
    });
}

window.onload = init;

function date_string(date, time) {
    var offset = new Date().getTimezoneOffset();
    if(offset >= 0) tz = "-"
    else {
        tz = "+";
        offset = -offset;
    }
    tz += (offset/60).toString().padStart(2, '0') + ":" + (offset%60).toString().padStart(2, '0');
    return date + "T" + time + ":00" + tz;
}

function create_problem(form) {
    data = extract_data(form.closest("form"));
    real_data = {};
    real_data["deadline"] = date_string(data["date:deadline"], data["time:deadline"]);
    real_data["release_date"] = date_string(data["date:release_date"], data["time:release_date"]);

    real_data["tags"] = data["tags"].split(",");
    real_data["statement"] = data["statement"];
    real_data["problem_id"] = data["problem_id"];
    real_data["omaforos_problem_id"] = data["omaforos_problem_id"];
    real_data["answer"] = data["answer"];
    real_data["annotations"] = data["annotations"];
    real_data["hint"] = data["hint"];
    real_data["official_solution"] = data["official_solution"];
    get_request("api/v1/admin/problem", real_data, true, "POST");
}