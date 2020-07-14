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
    payload.gender = {
        "masculino": "male",
        "femenino": "female",
        "prefiero no responder": ""}[payload.gender] || "other";
    payload.is_professor = undefined;
    payload.is_student = payload.is_student == "true";
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
    if (isDatalistValid("province")){
	    for(j of locations[tag.value]) {
	        loc.innerHTML += `<option>${j}</option>`
	    }
	}
    onDepartmentOrProvinceChange();
}

function event_updated_country(elem) {
	update_with_country_value(elem.value);
}

function update_with_country_value(value) {
	for(e of document.getElementsByClassName("if-argentinian")) {
        e.style.display = value == "Argentina" ? "block" : "none";
    }
    for(e of document.getElementsByClassName("if-not-argentinian")) {
        e.style.display = value == "Argentina" ? "none" : "block";
    }
    maybeShowSchoolForm();
}

function event_updated_student(elem) {
	update_with_is_student_value(elem.value);
}

function update_with_is_student_value(value) {
    for(e of document.getElementsByClassName("if-student")) {
        e.style.display = value == "true" ? "block" : "none";
    }
    for(e of document.getElementsByClassName("if-not-student")) {
        e.style.display = value == "true" ? "none" : "block";
    }
    maybeShowSchoolForm();
}

function event_updated_professor(elem) {
    for(e of document.getElementsByClassName("if-professor")) {
        e.style.display = elem.value == "true" ? "block" : "none";
    }
    for(e of document.getElementsByClassName("if-not-professor")) {
        e.style.display = elem.value == "true" ? "none" : "block";
    }
    maybeShowSchoolForm();
}

function maybeShowSchoolForm() {
	var is_student = $("input[name='is_student']:checked").val();
	var is_professor = $("input[name='is_professor']:checked").val();
	var should_show = false;
	if (is_professor == "true" || (is_student == "true" && $("input[name=country]").val() == "Argentina")) {
		should_show = true;
	}
	for(e of document.getElementsByClassName("if-professor-or-arg-student")) {
        e.style.display = (should_show ? "block" : "none");
    }
}

function checkSchoolsInput(input) {
	var province = $("input[name=province]").val()
	var department = $("input[name=department]").val()
	var MIN_LETTERS = 3;
	if (input.value.length == MIN_LETTERS && province.length > 0 && department.length > 0) {
		// por alguna razon en chrome no me anda el disabled, mientras no lleve mucho tiempo la carga no pasa nada
		$("#register_button").prop("disabled", true);
		askForSchools(input.value.toUpperCase(), province, department);
		$("#register_button").prop("disabled", false);
	} else if (input.value.length < MIN_LETTERS){
		setSchoolsOptions([]);
	}
}

function onDepartmentOrProvinceChange(){
	if (isDatalistValid("department") && isDatalistValid("province")){
		$(".school_input").prop("disabled", false);
		$(".school_input").prop("placeholder", "escuela");
	} else {
		$(".school_input").prop("disabled", true);
		$(".school_input").prop("placeholder", "escuela (primero selecciona provincia y departamento)");
	}
}

function isDatalistValid(datalist_id) {
	var datalist = document.getElementById(datalist_id);
	var input_val = document.getElementById(datalist_id + "_input").value;
	var optionFound = false;
	for (var j = 0; j < datalist.options.length; j++) {
		if (input_val == datalist.options[j].value) {
			optionFound = true;
			break;
		}
	}
	return optionFound;
}

$(document).ready(function(){
	$(".school_input").prop("disabled", true);
	$(".school_input").prop("placeholder", "escuela (primero selecciona provincia y departamento)");
	update_with_country_value($("input[name=country]").val());
	update_with_is_student_value($("input[name='is_student']:checked").val());
});

function setSchoolsOptions(schools){
	schools_datalist = document.getElementById("school");
    schools_datalist.innerHTML = ""
    for(school of schools) {
    	var option = document.createElement( 'option' );
    	option.value = school.Name;
    	schools_datalist.appendChild(option);
    }
}

function askForSchools(txt, province, department) {
	get_schools_matching_request(province, department, txt).then(x => {
		setSchoolsOptions(x);
	});
}
