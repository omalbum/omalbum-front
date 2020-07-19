function get_all_current_problems() {
	return get_current_problems().then(x => x.current_problems);
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
	if (is_active){
		td.appendChild(document.createTextNode("La prueba termina el"));
	}else{
		td.appendChild(document.createTextNode("Será publicado el"));
	}
	td.align="left";
	head.appendChild(td);
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
	return get_next_problems_request().then(x => x.next_problems);
}

function insert_index_problems(){
	var h2_active_problem = document.createElement("h2");
	h2_active_problem.appendChild(document.createTextNode("Problemas actuales"));
	h2_active_problem.className = "active-problem-h2";
	insert_some_problems_in_index("active-problems", get_all_current_problems, true, h2_active_problem);
	var h2_next_problems = document.createElement("h2");
	h2_next_problems.appendChild(document.createTextNode("Próximos problemas"));
	h2_next_problems.className = "next-problems-h2";
	insert_some_problems_in_index("next-problems", get_next_problems, false, h2_next_problems);
}

function index_problem_view(p, is_active, tbdy) {
	var tr = document.createElement("TR");
	tbdy.appendChild(tr);
	var problem_code = get_problem_code_to_show(p);
	var td = document.createElement("TD");;
	td.width = "75";
	if (is_active){
		var link = document.createElement("a");
		link.appendChild(document.createTextNode(problem_code));
		link.href = get_problem_url(p);
		td.appendChild(link);
	} else {
		td.appendChild(document.createTextNode(problem_code));
	}
	tr.appendChild(td);
	var td2=document.createElement("TD");
	if (is_active){
		td2.appendChild(document.createTextNode(get_nice_date_to_show(p.deadline)));
	} else {
		td2.appendChild(document.createTextNode(get_nice_date_to_show(p.release_date)));
	}
	tr.appendChild(td2);
}

