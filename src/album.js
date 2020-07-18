function get_problems() {
    if(is_logged_in()) {
        return get_album_request( user().user_id ).then(x => x.album);
    } else {
        return get_all_problems_request().then(x => x.all_problems);
    }
}

function problem_html(p) {
    tags = {}
    for(t of p.tags || []) {
        s = t.split(":")
        tags[s[0]] = s[1]
    }

    icon = "play_arrow"
    status = "normal"
    if (p.solved) {
    	icon = "done";
    	status = "success";
    }
    if (p.solved_during_contest){
    	icon = "star";
    	status = "success";
    }
    if (p.status == "failure") {
    	icon = "close";
    	status = "failure";
    }

    attempts = (p.attempts||0) + " intento" + (p.attempts == 1 ? "" : "s");
    if (!is_logged_in()){
    	attempts = "<br>";
    }

    return problem_view({
        "date": (p.solved ? get_album_date_format(p.date_solved) : "<br>"),
        "attempts": attempts,
        "code": get_problem_code_to_show(p),
        "icon": icon,
        "status": status,
        "url": get_problem_url(p)
    });
}

function get_album_date_format(date_solved) {
	var d = new Date(p.date_solved);
	return d.getDate().toString().padStart(2, '0') + "-" + d.getMonth().toString().padStart(2, '0') + "-" + d.getFullYear().toString();
}

function insert_given_problems(element, problems) {
    console.log(element);
    element.innerHTML = "";
    if( is_logged_in() && is_admin() ) {
        element.innerHTML += problem_view({
            "status": "normal",
            "code": "<br>",
            "icon": "create",
            "attempts": "<br>",
            "date": "<br>",
            "url": "admin.html"
        });
    }
    for(p of problems.sort(compare_problems)) {
        html = problem_html(p);
        element.innerHTML += html;
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

function get_problems_with_attempts(problems, user_id){
	if (!is_logged_in()){
		return problems;
	}
	return get_album_request( user().user_id ).then(x => {
		album = x.album;
		var current_problems_with_attempts = [];
		album_ids = new Map();
		for (problem of album){
			album_ids.set(problem.problem_id, problem);
		}
		for (problem of problems){
			if (album_ids.has(problem.problem_id)){
				current_problems_with_attempts.push(album_ids[problem.problem_id]);
			} else {
				current_problems_with_attempts.push(problem);
			}
		}
		return current_problems_with_attempts;
	});
}
