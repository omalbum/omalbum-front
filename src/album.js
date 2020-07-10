function get_problems() {
    if(is_logged_in()) {
        return get_request(`api/v1/users/${user().user_id}/album`, null, true, "GET")
            .then(x => x.album);
    } else {
        return get_request("api/v1/problems/all", null, false, "GET")
            .then(x => x.all_problems);
    }
}

function problem_html(p) {
    tags = {}
    for(t of p.tags || []) {
        s = t.split(":")
        tags[s[0]] = s[1]
    }

    icon = "play_arrow"
    if(p.status == "success") icon = "done";
    if(p.status == "star") icon = "star";
    if(p.status == "failure") icon = "close";

    status = "normal"
    if(p.status == "success") status = "success";
    if(p.status == "star") status = "success";
    if(p.status == "failure") status = "failure";

    attempts = (p.attempts||0) + " intento" + (p.attempts == 1 ? "" : "s");

    return problem_view({
        "date": new Date(p.deadline).toLocaleDateString('sv'),
        "attempts": attempts,
        "code": `#${p.series}${p.problem_id.toString().padStart(4, '0')}`,
        "icon": icon,
        "status": status,
        "url": `problema.html?id=${p.problem_id}`
    });
}

function insert_given_problems(element, problems) {
    console.log(element);
    element.innerHTML = "";
    for(p of problems) {
        html = problem_html(p);
        element.innerHTML += html;
    }
    if(is_logged_in() && user().user_name == "admin") {
        element.innerHTML += problem_view({
            "status": "normal",
            "code": "<br>",
            "icon": "plus_one",
            "attempts": "<br>",
            "date": "<br>",
            "url": "crear.html"
        });
    }
}

function insert_problems() {
    var elements = document.getElementsByClassName("problem-list");
    if(!elements.length == 0) {
        get_problems().then(problems => {
            for(e of elements) {
                insert_given_problems(e, problems);
            }
        });
    }
}


function problem_view(data) {
    return `
<a class="problem ${data.status}" href="${data.url}">
    <p class="code">${data.code}</p>
    <i class="material-icons problem-icon">${data.icon}</i>
    <p>${data.attempts}</p>
    <p class="date">${data.date}</p>
</a>`;
}
