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
			l = ["<p><a href=\"https://omaforos.com.ar/viewtopic.php?p=", post_id.toString(), "\" target=\"_blank\">Link al foro</a> para discutir este problema (no entres si aún no lo pensaste!).</p>"];
			document.getElementById("link-omaforos").innerHTML = l.join("");
		}
    });
    if (is_logged_in()){
    	$("#intentos").append($("<h2>").text("INTENTOS"));
	    get_problem_stats(user().user_id, problem_id).then(x => {
	    	if (x.attempt_list.length > 0) {
	    		add_intentos_to_table(x.attempt_list, true, x.deadline);
	    	} else {
	    		$("#intentos").append($("<label id='no_attempts'>").text("No hiciste intentos todavía"));
	    	}
	    });
	} else {
		$("#info_for_not_logged").append($('<p>Para poder enviar tu respuesta, <a href="./ingresar?p=' + problem_id.toString() + '">ingresá</a> a tu cuenta de OMAlbum o <a href="./registrarse?p=' + problem_id.toString() + '">registrate</a> si no tenés una.</p>'));
	}
}

function block_new_answers(solved) {
	$("#solution").prop("disabled", true);
	if (solved) {
		$("#attempt_button").val("Ya enviaste la respuesta correcta!");
	} else {
		$("#attempt_button").val("Ya enviaste una respuesta");
	}
	$("#attempt_button").prop("disabled", true);
}

function add_intentos_to_table(attempts, from_load, problem_deadline) {
	var table = undefined;
	if ($("#intentos_table").length > 0) {
		table = $("#intentos_table");
	} else {
		$("#no_attempts").css("display", "none");
		table = $("<table id='intentos_table'>");
		var th1 = $("<th>").text("Fecha intento");
		var th2 = $("<th>").text("Respuesta enviada");
		table.append($("<tr>").append(th1).append(th2));
		$("#intentos").append(table);
	}
	var titleTr = table.find("tr:first");
	for (attempt of attempts.sort(sort_attempts)){
		var td1 = $("<td>").text(get_nice_date_to_show_without_time_missing(attempt.attempt_date));
		var td2 = $("<td>").text(attempt.given_answer.toString());
		titleTr.after($("<tr>").addClass("result_" + attempt.result).append(td1).append(td2));
		if(attempt.result == "correct" || attempt.result == "wait") {
			block_new_answers(attempt.result == "correct");
			if (attempt.result == "wait" && from_load) {
				notify_patience(problem_deadline);
			}
		}
	}
}

function sort_attempts(x, y) {
	d1 = new Date(x.attempt_date).getTime();
	d2 = new Date(y.attempt_date).getTime();
	if (d1 != d2){
        	return d1 < d2 ? -1 : 1;
	}
	return x.given_answer >= y.given_answer ? -1 : 1;
}

function attempt_problem_event(form) {
    const urlParams = new URLSearchParams(window.location.search);
	const param = parseInt(urlParams.get('id'));
	answer = document.getElementById("solution").value;
	if( !is_integer(answer.toString()) || answer.toString().length > 10 || (answer.toString().length == 10 && answer.toString()[0] != "-")){
		clear_notifications();
		scrollToTopOnPage();
		return notify("notification urgent", "Tu respuesta no fue enviada.", "Debés ingresar un número entero de hasta 9 dígitos.");
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
	return `problema?id=${p.problem_id}`;
}

function notify_patience(deadline) {
	clear_notifications();
	return notify("notification wait", "Paciencia!", "Tenés que esperar hasta el "+ get_nice_date_to_show(deadline) + " para saber si tu respuesta es correcta.");
}

function attempt_feedback_for_user(x){
	add_intentos_to_table([{"attempt_date": x.attempt_date, "given_answer": parseInt(document.getElementById("solution").value), result: x.result}],
							false, undefined);
	if(x.result=="correct"){
		notify("notification good", "Bien!", "La respuesta es correcta.");
	}
	if(x.result=="incorrect"){
		notify("notification urgent", "Pensalo un rato más!", "La respuesta es incorrecta.");
	}
	if(x.result=="wait"){
		notify_patience(x.deadline);
	}
	scrollToTopOnPage();
}

function attempt_error_manager(x){
	clear_notifications();
	if(x.code=="problem_already_attempted_during_contest"){
		notify("notification urgent", "Error!", "Ya enviaste tu respuesta a este problema.");
		scrollToTopOnPage();
	}
}
