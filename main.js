var host = "http://localhost:8080/";

function update_preview() {
    previewer = document.getElementById("preview");
    previewed = document.getElementById("previewed");
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
                    "Bearer " + localStorage.getItem('token').token);
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

function login_or_profile() {
    if(is_logged_in()) {
        document.getElementsByTagName("nav")[0].innerHTML
            += `<a href="profile.html">profile</a>`
    } else {
        document.getElementsByTagName("nav")[0].innerHTML
            += `<a href="login.html">login</a><a href="register.html">register</a>`
    }
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

function on_event(class_name, action, event="click") {
    for(e of document.getElementsByClassName(class_name)) {
        e.addEventListener(event, function(ev) {
            if(ev) ev.preventDefault();
            action(this);
        });
    }
}

function extract_data(form) {
    var data = {};
    for(elem of form.childNodes) {
        if(elem.name) {
            data[elem.name] = elem.value;
        }
    }
    return data;
}

function init() {
    console.log("init");
    login_or_profile();
    on_event("register", register);
    on_event("login", login);
}

function is_logged_in() {
    expiration = localStorage.getItem('expiration')
    if(expiration) return Date.parse(expiration) > Date.now();
    return false;
}

function register(form) {
    data = extract_data(form.parentElement);
    console.log("DATA: " + JSON.stringify(data));
    get_request("api/v1/register", data, false, "POST").then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.user));
        console.log(token);
    });
}

function login(form) {
    data = extract_data(form.parentElement);
    get_request("api/v1/auth/login", data, false, "POST").then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.user));
        console.log(token);
    });
}

window.onload = init;