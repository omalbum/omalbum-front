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
		td.appendChild(document.createTextNode("Activo hasta"));
	}else{
		td.appendChild(document.createTextNode("Se publicará el"));
	}
	head.appendChild(td);
	var td = document.createElement("th");
	td.style.width = "20%";
	td.appendChild(document.createTextNode("Timer"));
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
        			if (is_active) {
        				problems = problems.sort(sort_active_problems);
        			} else {
        				problems = problems.sort(sort_next_problems);
        			}
        			insert_given_problems_in_index(e, problems, is_active);
        		} else if (is_active) {
        			e.appendChild(h2_obj);
        			var txt = document.createElement("p");
        			e.appendChild(txt);
					txt.innerHTML = `En este momento no hay problemas activos. Podés resolver los problemas ya publicados entrando <a href="./problemas">acá</a>.`
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
	h2_active_problem.style.marginBottom = "0.5rem";
	h2_active_problem.appendChild(document.createTextNode("Problemas activos"));
	h2_active_problem.className = "active-problem-h2";
	insert_some_problems_in_index("active-problems", get_all_current_problems, true, h2_active_problem);
	var h2_next_problems = document.createElement("h2");
	h2_next_problems.appendChild(document.createTextNode("Próximos problemas"));
	h2_next_problems.className = "next-problems-h2";
	h2_next_problems.style.marginBottom = "0.5rem";
	h2_next_problems.style.color = "white";
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
		td2.appendChild(document.createTextNode(get_nice_date_to_show_without_time_missing(p.deadline)));
	} else {
		td2.appendChild(document.createTextNode(get_nice_date_to_show_without_time_missing(p.release_date)));
	}
	tr.appendChild(td2);
	var td3=document.createElement("TD");
	td3.id = "timer_" + problem_code.substr(1);
	var date_for_timer;
	if (is_active){
		date_for_timer = new Date(p.deadline);
	} else {
		date_for_timer = new Date(p.release_date);
	}
	var diff = get_diff_date(date_for_timer);
	td3.appendChild(document.createTextNode(getTimerTime(diff)));
	var intervalID = window.setInterval(function() {
		var diff = get_diff_date(date_for_timer);
		if (diff >= 0) {
			$("#" + td3.id).text(getTimerTime(diff));
		}
		if (diff <= 0) {
			$("#" + td3.id).text(getTimerTime(0));
			window.clearInterval(intervalID);
			if (!is_active) {
				if(confirm("¡El problema " + get_problem_code_to_show(p) + " está activo! ¿Querés ir?")){
					window.location.href = get_problem_url(p);
				}else {
				window.location.href = ".";
				}
			} else {
				$("#" + td3.id).closest("tr").remove();	
			}
		}
	}, 1000);
	tr.appendChild(td3);
}

function get_diff_date(date_for_timer) {
	var diff = parseInt(date_for_timer - new Date());
	diff /= 1000;
	return parseInt(diff);
}

function getTimerTime(diff) {
	var ret = "";
	var days = parseInt(diff / (3600*24));
	if (days > 0){
		ret += days.toString().padStart(2, '0') + ":";
	}
	diff -= days*(3600*24);
	hours = parseInt(diff / 3600);
	if (hours > 0 || ret.length > 0){
		ret += hours.toString().padStart(2, '0') + ":";
	}
	diff -= hours*3600;
	minutes = parseInt(diff / 60);
	if (minutes > 0 || ret.length > 0){
		ret += minutes.toString().padStart(2, '0') + ":"
	}
	diff -= minutes*60;
	ret += diff.toString().padStart(2, '0');
	return ret;
}

function sort_active_problems (p,q){
	d1 = new Date(p.deadline).getTime()
	d2 = new Date(q.deadline).getTime()
	if (d1 != d2){
        	return d1 < d2 ? -1 : 1;
	}
	return get_problem_code_to_show(p) <= get_problem_code_to_show(q) ? -1 : 1;
}

function sort_next_problems (p,q){
        d1 = new Date(p.release_date).getTime()
        d2 = new Date(q.release_date).getTime()
        if (d1 != d2){
                return d1 < d2 ? -1 : 1;
        }
        return get_problem_code_to_show(p) <= get_problem_code_to_show(q) ? -1 : 1;
}
