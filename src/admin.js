function get_new_problem_payload(data) {
	return {
		deadline : date_string(data["date:deadline"], data["time:deadline"]),
		release_date : date_string(data["date:release_date"], data["time:release_date"]),
		tags : JSON.parse(data["tags"]).map( x => x.value ),
		statement : replaceEntersWithBr(data["statement"]),
		omaforos_post_id : parseInt(data["omaforos_post_id"]),
		answer : parseInt(data["answer"]),
		annotations : data["annotations"],
		is_draft : data["is_draft"],
		hint : data["hint"],
		series : data["series"],
		official_solution : data["official_solution"],
	};
}

function create_problem_event(form) {
    data = extract_data(form.closest("form"));
    payload = get_new_problem_payload(data);
	create_problem_with_validation(payload);
}

function update_problem_event(form, problem_id) {
    data = extract_data(form.closest("form"));
    payload = get_new_problem_payload(data);
	update_problem_with_validation(payload, problem_id);
}

function create_problem_with_validation(payload){
	validation_failures = validate_create_problem_payload(payload);
	if( validation_failures.length > 0 ){
		feedback_create_problem_validation_fails(validation_failures);
		return;
	}
	create_problem_request(payload).then(p => { //acá sería mejor manejar el error
		var txt = "Problema agregado";
		if (payload.is_draft){
			txt = "Problema creado como draft";
		}
		clear_notifications();
		notify("notification good", txt, "Para verlo podés ir <a href=\"" + host + get_problem_url(p) + "\">acá</a>  :)");
		window.scrollTo(0, 0);
	}).catch(err => {
		clear_notifications();
		notify("notification urgent", "No se pudo agregar", html_escape(err.code) || "Error desconocido");
		window.scrollTo(0, 0);
	});
}

function update_problem_with_validation(payload, problem_id){
	// TODO: No anda bien esto, supongo que por el back
	// pasan cosas raras con la hora
	validation_failures = validate_create_problem_payload(payload);
	if( validation_failures.length > 0 ){
		feedback_create_problem_validation_fails(validation_failures);
		return;
	}
	update_problem_request(payload, problem_id).then(p => { //acá sería mejor manejar el error
		var txt = "";
		if (payload.is_draft){
			txt = "Problema editado (sigue como draft)";
		} else {
			txt = "Problema editado! Code: " + get_problem_code_to_show(p);
		}
		clear_notifications();
		notify("notification good", txt, "Para verlo podés ir <a href=\"" + host + get_problem_url(p) + "\">acá</a>  :)");
		window.scrollTo(0, 0);
	}).catch(err => {
		clear_notifications();
		notify("notification urgent", "No se pudo editar", html_escape(err.code) || "Error desconocido");
		window.scrollTo(0, 0);
	});
}


function feedback_create_problem_validation_fails(validation_failures){
	clear_notifications();
	validation_failures.forEach( x => notify("notification urgent", x.field, x.error) );
	window.scrollTo(0, 0);
}

function update_preview(button) {
    previewer = document.getElementById("preview");
    previewed = document.getElementById(button.getAttribute("for"));
    previewer.innerHTML = replaceEntersWithBr(previewed.value);
    MathJax.typeset();
}

function insert_problems_admin(){
	var elements = document.getElementsByClassName("problems-admin");
    if(!elements.length == 0) {
	    get_problems_admin().then(problems => {
	        for(e of elements) {
	            insert_given_problems_admin(e, problems);
        	}
    	});
	}
}

function get_problems_admin() {
	if( is_logged_in() && is_admin() ) {
		return get_all_problems_admin_request().then( x => x.all_problems ); 
	}
}

function insert_given_problems_admin(element, problems) {
    console.log(element);
    element.innerHTML = "";
	drafts = [];
	scheduled = [];
	released = [];
    for(p of problems.sort(compare_problems)) {
		if (p["is_draft"]){
			drafts.push(p);
		}else{
			release = new Date(p["release_date"]);
			now =  new Date();
			if( now < release){
				scheduled.push(p); 
			}else{
				released.push(p);
			}
		}
    }
	element.innerHTML =  `<h2><a href="./admin_stats.html"> Ver stats </a><h2><br/>`;
	element.innerHTML +=  `<h2><a href="./crear.html"> Crear problema </a><h2>`;
	element.innerHTML += "<h2>Drafts</h2>"+ drafts.map(problem_admin_html).join("\n") + "<br/><br/> ";
	element.innerHTML += "<h2>Scheduled</h2>"+ scheduled.map(problem_admin_html).join("\n") + "<br/><br/><h2>Released</h2>"+ released.map(problem_admin_html).join("\n");
    MathJax.typesetPromise();
}

function problem_admin_html(data){
	if (data.omaforos_post_id>0 ){
		link_omaforos = `<a href=\"https://omaforos.com.ar/viewtopic.php?p=${data.omaforos_post_id}">link a omaforos </a><br/>`;
	}else{
		link_omaforos = "";	
	}
    return `
	<div>
		<h3>Problema ${data.problem_id} - ${get_problem_code_to_show(data)} - <a href = "editar.html?id=${data.problem_id}">editar</a> </h3>
		<div  class="enunciado math light-bg boxed">${data.statement}</div>
		Respuesta: ${data.answer}<br/>
		${link_omaforos}
		Fecha publicación: ${get_nice_date_to_show(new Date(data.release_date))}<br/>
		Deadline: ${get_nice_date_to_show(new Date(data.deadline))}
		<br/><br/>
	</div>`;
}

