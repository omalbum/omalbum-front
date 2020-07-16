function load_problem() {
    const urlParams = new URLSearchParams(window.location.search);
    const problem_id = urlParams.get('id');
    get_problem_request(problem_id).then(data => {
        var ele = document.getElementById("enunciado");
        ele.innerHTML = data.statement;
        var ele = document.getElementById("titulo");
        ele.innerHTML = "Problema " + get_problem_code_to_show(data) + ele.innerHTML;
        MathJax.typesetPromise();
		post_id = data["omaforos_post_id"];
		if(post_id != 0){
			l = ["<p><a href=\"https://omaforos.com.ar/viewtopic.php?p=", post_id.toString(), "\">Link al foro</a> para discutir este problema.</p>"];
			document.getElementById("link-omaforos").innerHTML = l.join("");
		}
    });
    if (is_logged_in()){
    	$("#intentos").append($("<h2>").text("INTENTOS"));
	    get_problem_stats(user().user_id, problem_id).then(x => {
	    	if (x.attempt_list.length > 0) {
	    		add_intentos_to_table(x.attempt_list);
	    	} else {
	    		$("#intentos").append($("<label id='no_attempts'>").text("No hiciste intentos todavía"));
	    	}
	    });
	}
}

function add_intentos_to_table(attempts) {
	var table = undefined;
	if ($("#intentos_table").length > 0) {
		table = $("#intentos_table");
	} else {
		$("#no_attempts").css("display", "none");
		table = $("<table id='intentos_table'>");
		var th1 = $("<th>").text("Fecha intento");
		var th2 = $("<th>").text("Repuesta enviada");
		table.append($("<tr>").append(th1).append(th2));
		$("#intentos").append(table);
	}
	for (attempt of attempts){
		var td1 = $("<td>").text(get_nice_date_to_show(attempt.attempt_date));
		var td2 = $("<td>").text(attempt.given_answer.toString());
		table.append($("<tr>").append(td1).append(td2));
	}
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


function get_problem_url(p){
	return `problema.html?id=${p.problem_id}`;
}

function attempt_feedback_for_user(x){
	add_intentos_to_table([{"attempt_date": new Date(), "given_answer": parseInt(document.getElementById("solution").value)}]);
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
