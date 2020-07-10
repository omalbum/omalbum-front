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
    payload = extract_data(form.closest("form"));
    payload.school_year = parseInt(payload.school_year);
	validation_failures = validate_register_payload(payload);
	if( validation_failures.length == 0 ){
	    return register(data);
	}else{
		feedback_register_validation_fails(validation_failures);
	}
}

function validate_register_payload(payload){
	// to do: agregar todas las validaciones
	var validation_failures = [];
	if(payload["name"]==""){
		validation_failures.push({ field:"Nombre", error: "No puede quedar vacío" });
	}
	if(payload["last_name"]==""){
		validation_failures.push({ field:"Apellido", error: "No puede quedar vacío" });
	}
	return validation_failures;
}

function feedback_register_validation_fails(validation_failures){
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

