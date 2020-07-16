function add_stats_to_frontend_admin() {
	if( is_logged_in() && is_admin() ) {
		return get_all_problems_stats_admin_request().then(add_stats_to_frontend);
	}
}

function createTr(txts, isHeader, isOdd) {
	var tr = $("<tr>");
	for (txt_or_obj of txts) {
		if (isHeader) {
			tr.append($("<th>").text(txt_or_obj));
		} else {
			if (txt_or_obj instanceof jQuery) {
				console.log("jquery");
				tr.append($("<td>").append(txt_or_obj));
			} else {
				tr.append($("<td>").text(txt_or_obj));
			}
			tr.addClass(isOdd ? "tr-odd" : "tr-even");
		}
	}
	return tr;
}

function add_stats_to_frontend(problems) {
	console.log(problems);
	var table = $("<table>");
	table.append(createTr(["ID", "Attempts", "Solved", "Solved Distinct", "Solved during contest", "Is current"], true));
	var idx = 0;
	for(problem of problems) {
		table.append(createTr([$("<a href='" + get_problem_url(problem) + "'>" + problem.problem_id + "</a>"), problem.attempts,
								problem.solved_distinct, problem.solved, problem.solved_during_contest, problem.is_current_problem ? "Sí" : "No"],
								false, idx%2));
		idx++;
	}
	$("#problems-stats-admin").append(table);
}