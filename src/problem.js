function load_problem() {
    const urlParams = new URLSearchParams(window.location.search);
    const problem_id = urlParams.get('id');
    get_problem_request(problem_id).then(data => {
        var ele = document.getElementById("enunciado");
        ele.innerHTML = data.statement;
        var ele = document.getElementById("titulo");
        ele.innerHTML = "Problema #" +data.series+ data.number_in_series.toString().padStart(4, '0') + ele.innerHTML;
        MathJax.typesetPromise();
		post_id = data["omaforos_post_id"];
		if(post_id != 0){
			l = ["<p><a href=\"https://omaforos.com.ar/viewtopic.php?p=", post_id.toString(), "\">Link al foro</a> para discutir este problema.</p>"];
			document.getElementById("link-omaforos").innerHTML = l.join("");
		}
    });
}

function attempt_problem_event(form) {
    const urlParams = new URLSearchParams(window.location.search);
	const param = parseInt(urlParams.get('id'));
	answer = document.getElementById("solution").value;
	if( !is_integer(answer.toString())){
		clear_notifications();
		return notify("notification urgent", "Tu respuesta no fue enviada.", "Debés ingresar un número entero.");
	}
	payload = {
        "problem_id": param,
        "answer": parseInt(answer),
    };
    attempt_problem(payload);
}

function attempt_problem(payload) {
	clear_notifications();
    attempt_problem_request(payload).then(attempt_feedback_for_user, attempt_error_manager);
}

function get_problem_code_to_show(p){
	return `#${p.series}${p.number_in_series.toString().padStart(4, '0')}`;
}

function get_problem_url(p){
	return `problema.html?id=${p.problem_id}`;
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
	clear_notifications();
	if(x.code=="problem_already_attempted_during_contest"){
		return notify("notification urgent", "Error!", "Ya intentaste este problema durante la prueba.");

	}
}
