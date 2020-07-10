function register(data) {
    return get_request("api/v1/register", data, false, "POST").then(() => {
        return login({
            "user_name": data.user_name,
            "password": data.password,
        });
    }).catch(err => {
        notify("notification urgent", "Registración Fallida", html_escape(err.code));
    });
}

function register_event(form) {
    data = extract_data(form.closest("form"));
    data.school_year = parseInt(data.school_year);
    return register(data);
}

function province_selector() {
    ele = document.getElementById("province");
    if(ele) {
        for(k in locations) {
            ele.innerHTML += `<option>${k}</option>`
        }
        loc = document.getElementById("department");
        for(k in locations) {
            for(j of locations[k]) {
                loc.innerHTML += `<option>${j}</option>`
            }
        }
    }
}

function reset_departments() {
    console.log("reset departamentos");
    loc = document.getElementById("department");
    tag = document.getElementsByName("province")[0];
    console.log(tag.value);
    loc.innerHTML = ""
    for(j of locations[tag.value]) {
        loc.innerHTML += `<option>${j}</option>`
    }
}

