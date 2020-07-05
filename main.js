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
            if(method=="GET" && payload) {
                var url = host
                    + endpoint
                    + "?data="
                    + encodeURIComponent(JSON.stringify(payload));
            } else {
                url = host + endpoint;
            }
            xhr.open(method, url, true);
            if(method != "GET" && payload) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            if(authorize && is_logged_in()) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem('token'));
            }
            xhr.onreadystatechange = function () {
                if(xhr.readyState == XMLHttpRequest.DONE) {
                    if (200 <= xhr.status && xhr.status < 300) {
                        console.log("PAYLAOD: " + endpoint + " + " + payload + " => " + xhr.responseText);
                        var json = JSON.parse(xhr.responseText);
                        callback(json);
                    } else {
                        console.log("request failed")
                        console.log(url)
                        console.log(xhr.readyState)
                        console.log(xhr.status)
                        console.log(xhr.response)
                        var json = JSON.parse(xhr.responseText);
                        fail(json);
                    }
                }
            };
            if(method == "GET" || !payload) {
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
    return get_request("api/v1/problems/all", null, false, "GET");
}

function user() {
    if(is_logged_in()){
        return JSON.parse(localStorage.getItem("user"))
    }
    else return null;
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
    tags = {}
    for(t of p.tags) {
        s = t.split(":")
        tags[s[0]] = s[1]
    }

    icon = "play_arrow"
    if(p.status == "success") icon = "done";
    if(p.status == "star") icon = "star";
    if(p.status == "failure") icon = "close";

    css_class = "normal"
    if(p.status == "success") css_class = "success";
    if(p.status == "star") css_class = "success";
    if(p.status == "failure") css_class = "failure";

    if(p.tries) intentos = `<p>${p.tries} intento${p!=1 ? "s" : ""}</p>`
    else intentos = `<p><br></p>`

    return `
    <a class="problem ${css_class}" href="problema.html?id=${p.problem_id}">
        <p class="code">#${tags.serie}${p.problem_id}</p>
        <i class="material-icons problem-icon">${icon}</i>
        ${intentos}
        <p class="date">${new Date(p.deadline).toLocaleDateString('sv')}</p>
    </a>
    `
}

function insert_given_problems(element, problems) {
    console.log(element);
    element.innerHTML = "";
    for(p of problems) {
        html = problem_html(p);
        element.innerHTML += html
    }
    if(is_logged_in && user().user_name == "admin") {
        element.innerHTML += `
                <a class="problem normal" href="crear.html">
                    <p class="code"><br></p>
                    <i class="material-icons problem-icon">plus_one</i>
                    <p><br></p>
                    <p class="date"><br></p>
                </a>
`
    }
}

function insert_problems() {
    var elements = document.getElementsByClassName("problem-list");
    if(!elements.length == 0) {
        get_problems().then(problems => {
            for(e of elements) {
                insert_given_problems(e, problems.all_problems);
            }
        });
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
    insert_problems();
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
    get_request("api/v1/register", data, false, "POST").catch(function(err) {
        if(err.user_id) {
            notify("notification good", "Bien!", "Te registraste correctamente! ahora loggeate!");
        } else {
            notify("notification urgent", "Error!", html_escape(err.code));
        }
    });
}

function login(form) {
    data = extract_data(form.closest("form"));
    get_request("api/v1/auth/login", data, false, "POST").then(token => {
        localStorage.setItem('token', token.token);
        localStorage.setItem('expiration', token.expiration);
        localStorage.setItem('user', JSON.stringify(token.User));
        window.location.href = "index.html";
    }).catch(err => {
        notify("notification urgent", "Error!", html_escape(err.code));
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

function load_problem() {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('id')
    get_request(`api/v1/problems/problem/${param}`, null, false, "GET").then(data => {
        var ele = document.getElementById("enunciado");
        ele.innerHTML = data.statement;
        var ele = document.getElementById("titulo");
        ele.innerHTML = "Problema #" + data.problem_id + ele.innerHTML;
        MathJax.typesetPromise();
    });
}

function html_escape(text) {
    var text_node = document.createTextNode(text);
    return text_node.textContent;
}

function notify(urgency, title, text) {
    var main = document.getElementsByTagName("main")[0];
    // var body = document.getElementsByTagName("body")[0];
    main.insertAdjacentHTML('beforebegin', `<div class="${urgency}"><h1>${title}</h1><p>${text}</p><div>`)
}
