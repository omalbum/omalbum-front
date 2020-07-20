function register_request(payload){
	return do_request("api/v1/register", payload, false, "POST");
}

function update_user_request(payload){
	return do_request("api/v1/users/" + user().user_id + "/profile", payload, true, "PUT");
}

function login_request(payload){
	return do_request("api/v1/auth/login", payload, false, "POST");
}

function get_all_problems_request(){
	return do_request("api/v1/problems/all", null, false, "GET");
}


function get_current_problems(){
	return do_request("api/v1/problems/current", null, false, "GET");
}


function get_all_problems_admin_request(){
	return do_request("api/v1/admin/problems/all", null, true, "GET");
}

function get_all_problems_stats_admin_request(){
	return do_request("api/v1/admin/problems/all/stats", null, true, "GET");
}


function get_album_request(user_id){
	return do_request("api/v1/users/" + user_id.toString() + "/album", null, true, "GET");
}

function get_problem_request(problem_id){
	return do_request("api/v1/problems/problem/" + problem_id.toString(), null, false, "GET");
}

function get_admin_problem_request(problem_id) {
	return do_request("api/v1/admin/problem/" + problem_id.toString(), null, true, "GET");
}

function get_next_problems_request(){
	return do_request("api/v1/problems/next", null, false, "GET");
}

function attempt_problem_request(payload){
    return do_request("api/v1/users/answer/",payload,true,"POST");
}

function create_problem_request(payload){
	return 	do_request("api/v1/admin/problem", payload, true, "POST");
}

function update_problem_request(payload, problem_id){
	return 	do_request("api/v1/admin/problem/" + problem_id.toString(), payload, true, "PUT");
}

function get_problem_stats(user_id, problem_id){
	return do_request("api/v1/users/"+ user_id.toString() + "/attempts/" + problem_id.toString(), null, true, "GET");
}

function _get_schools_matching_request(province, department, text){
	return 	do_request("api/v1/schools/" + province + "/" + department + "/" + text, null, false, "GET");
}

// https://stackoverflow.com/a/24468752
function do_request(endpoint, payload, authorize, method) {
    return new Promise (
        function(callback, fail) {
            var xhr = new XMLHttpRequest();
            if(method=="GET" && payload) {
                var url = host
                    + endpoint
                    + "?data="
                    + encodeURIComponent(JSON.stringify(payload));
            } else {
                url = host + endpoint;
            }
            xhr.open(method, url, true);
            if(method != "GET" && payload) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            if(authorize && is_logged_in()) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem('token'));
            }
            xhr.onreadystatechange = function () {
                if(xhr.readyState == XMLHttpRequest.DONE) {
                    if (200 <= xhr.status && xhr.status < 300) {
                        console.log("PAYLOAD: " + endpoint + " + " + payload + " => " + xhr.responseText.substr(0,1000) );
                        var json = JSON.parse(xhr.responseText);
                        callback(json);
                    } else {
                        console.log("request failed")
                        console.log(url)
                        console.log(xhr.readyState)
                        console.log(xhr.status)
                        console.log(xhr.response)
                        var json = JSON.parse(xhr.responseText);
                        fail(json);
                    }
                }
            };
            if(method == "GET" || !payload) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(payload));
            }
        }
    );
}

