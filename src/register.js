function register_with_validation(payload) {
	validation_failures = validate_register_payload(payload);
	if( validation_failures.length >0 ){
		feedback_register_validation_fails(validation_failures);
		return;
	}
    return register_request(payload).then(() => {
        return login(payload.user_name, payload.password);
    }).catch(err => {
		clear_notifications();
        notify("notification urgent", "Registración Fallida", html_escape(err.code));
    });
}

function register_event(form) {
    payload = extract_data(form.closest("form"));
    payload.school_year = parseInt(payload.school_year);
	return register_with_validation(payload);
}



function feedback_register_validation_fails(validation_failures){
	clear_notifications();
	validation_failures.forEach( x => notify("notification urgent", x.field, x.error) );
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

