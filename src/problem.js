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
    get_request("api/v1/users/answer/", data,true,"POST").then(x => {
        notify("notification urgent", x.result, x.result);
    });
}
