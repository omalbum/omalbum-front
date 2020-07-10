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


function attempt_problem_event(form) {
    const urlParams = new URLSearchParams(window.location.search);
	const param = parseInt(urlParams.get('id'));
    form = form.closest("form")
    attempt_problem({
        "problem_id": param,
        "answer": parseInt(form.solution.value),
    });
}

function attempt_problem(data) {
    get_request("api/v1/users/answer/", data,true,"POST").then(attempt_feedback_for_user, attempt_error_manager);
}

function attempt_feedback_for_user(x){
	if(x.result=="correct"){
		return notify("notification good", "Bien!", "La solución es correcta");
	}
	if(x.result=="incorrect"){
		return notify("notification urgent", "Qué lástima!", "La solución es incorrecta");
	}
	if(x.result=="wait"){
		return notify("notification wait", "Paciencia!", "Tenés que esperar hasta las "+ x.deadline + " para saber si tu solución es correcta.");
	}
}

function attempt_error_manager(x){
	if(x.code=="problem_already_attempted_during_contest"){
		return notify("notification urgent", "Error!", "Ya intentaste este problema durante la prueba.");

	}
}
