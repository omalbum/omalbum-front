// https://stackoverflow.com/a/24468752
function get_request(endpoint, payload, authorize, method) {
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
                        console.log("PAYLAOD: " + endpoint + " + " + payload + " => " + xhr.responseText);
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

