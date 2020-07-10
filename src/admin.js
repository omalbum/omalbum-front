function create_problem(form) {
    data = extract_data(form.closest("form"));
    payload = {
		deadline : date_string(data["date:deadline"], data["time:deadline"]),
		release_date : date_string(data["date:release_date"], data["time:release_date"]),
		tags: data["tags"].split(","),
		statement: data["statement"],
		problem_id: parseInt(data["problem_id"]), // ojo con esto!
		omaforos_post_id: parseInt(data["omaforos_post_id"]),
		answer: parseInt(data["answer"]),
		annotations: data["annotations"],
		hint: data["hint"],
		series: data["series"],
		official_solution: parseInt(data["official_solution"]),
	};
	validation_failures = validate_create_problem_payload(payload);
	if( validation_failures.length == 0 ){
	    get_request("api/v1/admin/problem", payload, true, "POST");
	}else{
		feedback_create_problem_validation_fails(validation_failures);
	}
}


function validate_create_problem_payload(payload){
	// to do: agregar todas las validaciones
	var validation_failures = [];
	if(! is_nontrivial( payload["statement"] ) ){
		validation_failures.push({ field:"Enunciado", error: "No puede quedar vacío" });
	}
	if(! is_nontrivial( payload["series"] ) ){
		validation_failures.push({ field:"Serie", error: "No puede quedar vacío" });
	}
	return validation_failures;
}

function feedback_create_problem_validation_fails(validation_failures){
	clear_notifications();
	validation_failures.forEach( x => notify("notification urgent", x.field, x.error) );
}

function update_preview(button) {
    previewer = document.getElementById("preview");
    previewed = document.getElementById(button.getAttribute("for"));
    previewer.innerHTML = previewed.value;
    MathJax.typeset();
}
