all_countries = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica',
		'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
		'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia',
		'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam',
		'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands',
		'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia',
		'Comoros', 'Congo', 'Congo, The Democratic Republic of The', 'Cook Islands', 'Costa Rica', "Cote D'ivoire", 'Croatia',
		'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
		'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana',
		'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
		'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-bissau', 'Guyana', 'Haiti',
		'Heard Island and Mcdonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland',
		'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
		'Kiribati', 'Korea', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho',
		'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao',
		'Macedonia, The Former Yugoslav Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
		'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of',
		'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
		'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
		'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestina', 'Panama',
		'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion',
		'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Pierre and Miquelon',
		'Saint Vincent and The Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
		'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
		'South Africa', 'South Georgia and The South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
		'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China',
		'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago',
		'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
		'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela',
		'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.S', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']


function register_with_validation(payload) {
	validation_failures = validate_register_payload(payload);
	all_validation_failures = validation_failures.concat(custom_validate_register_payload(payload));
	if( all_validation_failures.length > 0 ){
		feedback_register_validation_fails(all_validation_failures);
		return;
	}
    return register_request(payload).then(() => {
        return login(payload.user_name, payload.password);
    }).catch(err => {
		clear_notifications();
		if(err.code=="username_already_taken"){
	        notify("notification urgent", "Registración Fallida", html_escape("Nombre de usuario ya utilizado"));
		}else if(err.code=="email_already_taken"){
	        notify("notification urgent", "Registración Fallida", html_escape("Email ya utilizado"));
		} else{
	        notify("notification urgent", "Registración Fallida", html_escape(err.message));
		}
		window.scrollTo(0, 0);
    });
}

function custom_validate_register_payload(payload){
	var custom_validation_failures = [];
	if ((isStudent() && isFromArg()) || isProfessor()){
		if (! isDatalistValid("province")){
			custom_validation_failures.push({ field:"Provincia", error: "Debe ser una opción válida" });
		} else if (! isDatalistValid("department")){
			custom_validation_failures.push({ field:"Departamento", error: "Debe ser una opción válida" });
		} else if (! isDatalistValid("school")){
			custom_validation_failures.push({ field:"Escuela", error: "Debe ser una opción válida" });
		}
	}
	if (isStudent()) {
		if (! (is_integer(document.getElementById("school_year_input").value) && 1 <= parseInt(payload.school_year) &&  parseInt(payload.school_year) <= 15) ){
			custom_validation_failures.push({ field:"Año de escolaridad", error: "Debe ser un número válido" });
		}
	}
	if (! isDatalistValid("gender")){
		custom_validation_failures.push({ field:"Género", error: "Debe ser una opción válida" });
	}
	if (! isDatalistValid("country")){
		custom_validation_failures.push({ field:"País", error: "Debe ser una opción válida" });
	}
	return custom_validation_failures;
}

function register_event(form) {
    payload = extract_data(form.closest("form"));
    payload.school_year = parseInt(payload.school_year);
    payload.gender = getGenderValueForPayload(payload.gender);
    payload.is_teacher = (payload.is_professor=="true");
    payload.is_student = (payload.is_student == "true");
	return register_with_validation(payload);
}

function getGenderValueForPayload(gender_input_val) {
	if (gender_input_val == "masculino"){
		return "masculino";
	} else if (gender_input_val == "femenino"){
		return "femenino";
	} else if (gender_input_val == "prefiero no responder"){
		return "prefiero no responder";
	} else if (gender_input_val == "otro"){
		return document.getElementById("gender_other_input").value || "otro";
	} else {
		return "";
	}
}


function feedback_register_validation_fails(validation_failures){
	clear_notifications();
	validation_failures.forEach( x => notify("notification urgent", x.field, x.error) );
	window.scrollTo(0, 0);
}


function register_init(){
	this_year = new Date().getFullYear();
	ele = document.getElementById("title_student_this_year");
	if(ele){
		ele.innerHTML=`Durante el año ${this_year}, ¿sos estudiante regular de primaria o secundaria?`
	}
	province_selector();

}

function province_selector() {
    ele = document.getElementById("province");
	opts = [];
    if(ele) {
		if (is_logged_in()){
			window.location.replace(".");
			return;
		}
        for(k in locations) {
			opts.push(`<option>${k}</option>`);
        }
        ele.innerHTML = opts.join("\n");
    }
}

function reset_departments() {
    loc = document.getElementById("department");
    tag = document.getElementsByName("province")[0];
    loc.innerHTML = ""
    if (isDatalistValid("province")){
	    for(j of locations[tag.value]) {
	        loc.innerHTML += `<option>${j}</option>`
	    }
		document.getElementById("department_input").placeholder = "departamento o partido";
		document.getElementById("department_input").disabled = false;
	}else{
		document.getElementById("department_input").placeholder = "departamento o partido (primero seleccionar provincia)";
		document.getElementById("department_input").disabled = true;
	}
	document.getElementById("department_input").value = "";
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

function isStudent() {
	return $("input[name='is_student']:checked").val() == "true";
}

function isProfessor() {
	return !isStudent() && $("input[name='is_professor']:checked").val() == "true";
}

function isFromArg() {
	return $("input[name=country]").val() == "Argentina";
}

function maybeShowSchoolForm() {
	var should_show = false;
	if (isProfessor() || (isStudent() && isFromArg())) {
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
		$("#school_input").prop("disabled", false);
		$("#school_input").prop("placeholder", "escuela");
		$("#locality_input").prop("disabled", false);
		$("#locality_input").prop("placeholder", "localidad");
		province = $("#province_input").val();
		department = $("#department_input").val();
		askForLocations(province,department);
	} else {
		$("#school_input").prop("disabled", true);
		$("#school_input").prop("placeholder", "escuela (primero selecciona provincia y departamento)");
		$("#locality_input").prop("disabled", true);
		$("#locality_input").prop("placeholder", "localidad (primero selecciona provincia y departamento)");

	}
	$("#school_input").val("");
	$("#locality_input").val("");
}

function onGenderChange() {
	if (document.getElementById("gender_input").value == "otro"){
		$("#gender_other").css("display", "block");
	} else {
		$("#gender_other").css("display", "none");
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
	$("#department_input").prop("disabled", true);
	$("#locality_input").prop("disabled", true);
	$("#school_input").prop("disabled", true);
	$("#department_input").placeholder = "departamento o partido (primero selecciona provincia)";
	$("#locality_input").prop("placeholder", "localidad (primero selecciona provincia y departamento)");
	$("#school_input").prop("placeholder", "escuela (primero selecciona provincia y departamento)");
	update_with_country_value($("input[name=country]").val());
	update_with_is_student_value($("input[name='is_student']:checked").val());
});

function setSchoolsOptions(schools){
	schools_datalist = document.getElementById("school");
    schools_datalist.innerHTML = "";
	opts = [];
    for(school of schools) {
		opts.push(`<option>${school.Name}</option>`);
    }
	schools_datalist.innerHTML = opts.join("\n");
}

function askForSchools(txt, province, department) {
	get_schools_matching_request(province, department, txt).then(setSchoolsOptions);
}

function setLocationOptions(localities){
	localities_datalist = document.getElementById("locality");
    localities_datalist.innerHTML = "";
	opts = [];
    for(locality of localities) {
		opts.push(`<option>${locality}</option>`);
    }
	localities_datalist.innerHTML = opts.join("\n");
}

function askForLocations(province,department){
	$.getJSON( "./jsons/provincias/"+province+"/"+department+".json", setLocationOptions);
}

