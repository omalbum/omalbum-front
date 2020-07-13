function get_all_current_problems() {
	return get_current_problems().then(x => {
	    if(is_logged_in()) {
	        return get_problems_with_attempts(x.current_problems);
	    } else {
	        return x.current_problems;
	    }
	});
}

function insert_given_problems_in_index(element, problems, is_active) {
	var table = document.createElement("table");
	var tbdy = document.createElement('tbody');
	table.appendChild(tbdy);	
	var head = document.createElement("tr");
	tbdy.appendChild(head);
	var td = document.createElement("th");
	td.appendChild(document.createTextNode("Problema"));
	head.appendChild(td);
	var td = document.createElement("th");
	td.appendChild(document.createTextNode("Hasta cuando estará activo"));
	head.appendChild(td);
	if (is_active && is_logged_in()){
		var td = document.createElement("th");
		td.appendChild(document.createTextNode("Intentado?"));
		head.appendChild(td);
	}
    for(p of problems) {
        index_problem_view(p, is_active, tbdy);
    }
    element.appendChild(table);
}

function insert_some_problems_in_index(problems_div_class, get_problems_function, is_active, h2_obj) {
    var elements = document.getElementsByClassName(problems_div_class);
    if(!elements.length == 0) {
        get_problems_function().then(problems => {
        	for(e of elements) {
        		if (problems.length > 0){
        			e.appendChild(h2_obj);
            		insert_given_problems_in_index(e, problems, is_active);
            	}
            }
        });
    }
}

function get_next_problems(){
	return get_next_problems_request().then(x => get_problems_with_attempts(x.next_problems));
}

function insert_index_problems(){
	var h2_acive_problem = document.createElement("h2");
	h2_acive_problem.appendChild(document.createTextNode("Problema activo"));
	h2_acive_problem.className = "active-problem-h2";
	insert_some_problems_in_index("active-problems", get_all_current_problems, true, h2_acive_problem);
	var h2_next_problems = document.createElement("h2");
	h2_next_problems.appendChild(document.createTextNode("Próximos problemas"));
	h2_next_problems.className = "next-problems-h2";
	insert_some_problems_in_index("next-problems", get_next_problems, false, h2_next_problems);
}

function index_problem_view(p, is_active, tbdy) {
	var tr = document.createElement("TR");
	tbdy.appendChild(tr);
	var problem_code = get_problem_code_to_show(p);
	if (is_active){
		if (is_logged_in()){
			return get_problem_stats(user().user_id, p.problem_id).then(stats => {
				var link = document.createElement("a");
				link.appendChild(document.createTextNode(problem_code));
				link.href = get_problem_url(p);
				var td = document.createElement("TD");
				td.width = "75";
				td.appendChild(link);
				tr.appendChild(td);
				var td2=document.createElement("TD");
				td2.appendChild(document.createTextNode(get_nice_date_to_show(p.deadline)));
				tr.appendChild(td2);
				var td3=document.createElement("TD");
				if (stats.solved){
					td3.appendChild(document.createTextNode("Ya lo resolviste!"));
				} else if (stats.attempts > 0){
					td3.appendChild(document.createTextNode("Ya enviaste una respuesta incorrecta, no podés seguir enviando hasta que se termine la competencia"));
				} else {
					td3.appendChild(document.createTextNode("Todavía no lo intentas, mandate!"));
				}
				tr.appendChild(td3);
			});
		} else {
			var link = document.createElement("a");
			link.appendChild(document.createTextNode(problem_code));
			link.href = get_problem_url(p);
			var td = document.createElement("TD");
			td.width = "75";
			td.appendChild(link);
			tr.appendChild(td);
			var td2=document.createElement("TD");
			td2.appendChild(document.createTextNode(get_nice_date_to_show(p.deadline)));
			tr.appendChild(td2);
		}
	} else {
		var td = document.createElement("TD");
		td.appendChild(document.createTextNode(problem_code));
		tr.appendChild(td);
		var td = document.createElement("TD");
		td.appendChild(document.createTextNode(get_nice_date_to_show(p.release_date)));
		tr.appendChild(td);
	}
}

