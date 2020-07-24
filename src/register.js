all_countries = [' Santo Tomé y Príncipe', 'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Anguilla', 'Antigua y Barbuda', 'Antillas Holandesas', 'Antártida', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Banglades', 'Barbados', 'Baréin', 'Belice', 'Benin', 'Bermudas', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia-Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Butan', 'Bélgica', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Chad', 'Chile', 'China', 'Chipre', 'Ciudad del Vaticano', 'Colombia', 'Comoras', 'Congo', 'Corea del Norte', 'Corea del Sur', 'Costa Rica', 'Costa de Marfil', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'España', 'Estado de Palestina', 'Estados Federados de Micronesia', 'Estados Unidos', 'Estonia', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Gibraltar', 'Granada', 'Grecia', 'Groenlandia', 'Guadalupe', 'Guam', 'Guatemala', 'Guayana Francesa', 'Guernsey', 'Guinea', 'Guinea Ecuatorial', 'Guinea-Bisau', 'Guyana', 'Haití', 'Holanda', 'Honduras', 'Hong Kong', 'Hungría', 'India', 'Indonesia', 'Iraq', 'Irlanda', 'Irán', 'Isla de Man', 'Isla de Navidad', 'Isla de San Martín', 'IslaNorfolk', 'Islandia', 'Islas Caimán', 'Islas Cocos', 'Islas Cook', 'Islas Feroe', 'Islas Marshall', 'Islas Pitcairn', 'Islas Salomón', 'Islas Turcas y Caicos', 'Islas Vírgenes Británicas', 'Islas Vírgenes de los Estados Unidos', 'IslasMarianasdelNorte', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jersey', 'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Líbano', 'Macao', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malta', 'Malí', 'Marruecos', 'Martinica', 'Mauricio', 'Mauritania', 'Mayotte', 'Moldavia', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Mozambique', 'México', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Noruega', 'Nueva Caledonia', 'Nueva Zelanda', 'Omán', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polinesia Francesa', 'Polonia', 'Portugal', 'Puerto Rico', 'Qatar', 'Reino Unido', 'República Centroafricana', 'República Checa', 'República Democrática del Congo', 'República Dominicana', 'República de Macedonia', 'Reunion', 'Ruanda', 'Rumania', 'Rusia', 'Samoa', 'Samoa Americana', 'San Bartolome', 'San Cristóbal y Nieves', 'San Marino', 'San Pedro y Miquelon', 'San Vicente y las Granadinas', 'Santa Elena, Ascensión y Tristán de Acuña', 'Santa Lucía', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Svalbard y Jan Mayen', 'Tailandia', 'Taiwán', 'Tanzania', 'Tayikistán', 'Territorio Británico del Océano Índico', 'Timor Oriental', 'Togo', 'Tokelau', 'Tonga', 'Trinidad y Tobago', 'Turkmenistán', 'Turquía', 'Tuvalu', 'Túnez', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Venezuela', 'Vietnam', 'Wallis y Futuna', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue', 'Åland']


function setCountries(){
	country_datalist = document.getElementById("country");
	if (country_datalist){
		country_datalist.innerHTML = "";
		opts = [];
		for(c of all_countries) {
			opts.push(`<option>${c}</option>`);
		}
		country_datalist.innerHTML = opts.join("\n");
	}
}

function register_with_validation(payload) {
	validation_failures = validate_register_payload(payload, true);
	all_validation_failures = validation_failures.concat(custom_validate_register_payload(payload,
																						$("#locality_div").css("display") != "none",
																						$("#school_div").css("display") != "none"));
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
		} else if(err.code=="email_already_taken"){
	        notify("notification urgent", "Registración Fallida", html_escape("Email ya utilizado"));
		} else if(err.code=="email_validation_is_email"){
	        notify("notification urgent", "Registración Fallida", html_escape("El email no es válido"));
		} else{
	        notify("notification urgent", "Registración Fallida", html_escape(err.message));
		}
		window.scrollTo(0, 0);
    });
}

function custom_validate_register_payload(payload, check_locality, check_school){
	var custom_validation_failures = [];
	if (check_locality){
		if (! isDatalistValid("province")){
			custom_validation_failures.push({ field:"Provincia", error: "Debe ser una opción válida" });
		} else if (! isDatalistValid("department")){
			custom_validation_failures.push({ field:"Departamento", error: "Debe ser una opción válida" });
		} else if (! isDatalistValid("locality")){
			custom_validation_failures.push({ field:"Localidad", error: "Debe ser una opción válida" });
		}
	}
	if (check_school && !$("#school_input").prop("disabled")){
		if ($("#school_not_found_checkbox:checked").val() == undefined) {
			if (! isDatalistValid("school")){
				custom_validation_failures.push({ field:"Escuela", error: "Debe ser una opción válida" });
			} 
		} else {
			if ($("#written_school_name").val() == "") {
				custom_validation_failures.push({ field:"Escuela", error: "Si no encontrás tu escuela, escribí el nombre donde corresponde" });
			}
		}
	}
	if (isStudent()) {
		if (! (is_integer(document.getElementById("school_year_input").value) && 1 <= parseInt(payload.school_year) &&  parseInt(payload.school_year) <= 15) ){
			custom_validation_failures.push({ field:"Año de escolaridad", error: "Debe ser un número válido" });
		}
	}
	if ($('input[type=radio][name=gender]:checked').val() === undefined){
		custom_validation_failures.push({ field:"Género", error: "Debe ser una opción válida" });
	}
	if (! isDatalistValid("country")){
		custom_validation_failures.push({ field:"País", error: "Debe ser una opción válida" });
	}
	if (!isStudent() && $('input[type=radio][name=is_teacher]:checked').val() === undefined){
		custom_validation_failures.push({ field:"Sos docente?", error: "Completá con la información que corresponda" });
	}
	return custom_validation_failures;
}

function register_event(form) {
	payload = get_register_payload(form);
	return register_with_validation(payload);
}

function get_register_payload(form) {
	payload = extract_data(form.closest("form"));
    if (isTeacher() || (isStudent() && isFromArg())) {
	    payload.school = getSchoolNameFromOptionOrHardcoded();
	} else {
		payload.school = "";
	}
	if (!isTeacher() && !isFromArg()) {
	    payload.province = "";
		payload.department = "";
		payload.location = "";
	}
	if (isStudent()) {
	    payload.school_year = parseInt(payload.school_year);
	} else {
		payload.school_year = undefined;
	}
    payload.gender = getGenderValueForPayload(payload.gender);
    payload.is_teacher = isTeacher();
    payload.is_student = isStudent();
    return payload;
}

function getGenderValueForPayload(gender_input_val) {
	if ($('input[type=radio][name=gender]:checked').val() != "otro") {
		return $('input[type=radio][name=gender]:checked').val();
	} else {
		return $("#gender_other_input").val();
	}
}

function getSchoolNameFromOptionOrHardcoded() {
	if ($("#school_not_found_checkbox:checked").val() == undefined) {
		return $("#school_input").val();
	} else {
		return $("#written_school_name").val();
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
	create_footer();
}

function province_selector() {
    ele = document.getElementById("province");
	opts = [];
    if(ele) {
    	// TODO: Si comento esto la gente podría ir a /register estando logueada
		/*if (is_logged_in()){
			window.location.replace(".");
			return;
		}
		*/
        for(k in all_departments) {
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
	    for(j of all_departments[tag.value]) {
	        loc.innerHTML += `<option>${j}</option>`
	    }
		document.getElementById("department_input").placeholder = "departamento o partido";
		document.getElementById("department_input").disabled = false;
	}else{
		document.getElementById("department_input").placeholder = "primero seleccionar provincia";
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
        e.style.display = value == "Argentina" ? "" : "none";
    }
    for(e of document.getElementsByClassName("if-not-argentinian")) {
        e.style.display = value == "Argentina" ? "none" : "";
    }
    maybeShowSchoolForm();
    maybeShowLocalityDiv();
}

function event_updated_student(elem) {
	update_with_is_student_value(elem.value);
}

function update_with_is_student_value(value) {
    for(e of document.getElementsByClassName("if-student")) {
        e.style.display = value == "true" ? "" : "none";
    }
    for(e of document.getElementsByClassName("if-not-student")) {
        e.style.display = value == "true" ? "none" : "";
    }
    maybeShowSchoolForm();
    maybeShowLocalityDiv();
}

function schoolNotFoundClick() {
	if ($("#school_not_found_checkbox:checked").val() != undefined) {
		$("#written_school_name").css("display", "");
		$("#written_school_name").prop("disabled", false);
		$("#written_school_name").focus();
	} else {
		$("#written_school_name").prop("disabled", true);
	}
}

function event_updated_teacher(elem) {
	update_with_is_teacher_value(elem.value);
}

function update_with_is_teacher_value(value) {
	if (value == 'true' || $('input[type=radio][name=is_student]:checked').val() == 'true') {
		$("#school_div").css("display", "");
	} else {
		$("#school_div").css("display", "none");
	}
    for(e of document.getElementsByClassName("if-teacher")) {
        e.style.display = value == "true" ? "" : "none";
    }
    for(e of document.getElementsByClassName("if-not-teacher")) {
        e.style.display = value == "true" ? "none" : "";
    }
    maybeShowSchoolForm();
    maybeShowLocalityDiv();
}

function isStudent() {
	return $("input[name='is_student']:checked").val() == "true";
}

function isTeacher() {
	return !isStudent() && $("input[name='is_teacher']:checked").val() == "true";
}

function isFromArg() {
	return $("input[name=country]").val() == "Argentina";
}

function maybeShowSchoolForm() {
	var should_show = false;
	if (isTeacher() || (isStudent() && isFromArg())) {
		should_show = true;
	}
	for(e of document.getElementsByClassName("if-argentinian-and-student-or-teacher-defined")) {
        e.style.display = (should_show ? "" : "none");
    }
    $("#school_div").css("display", should_show ? "" : "none");
}

function maybeShowLocalityDiv() {
	if ((isFromArg() && (isStudent() || $("input[name='is_teacher']:checked").val() != undefined)) || isTeacher()) {
    	$(".locality_div").css("display", "");
    	if ($("#province_input").val() == ""){
	    	reset_departments();
			onDepartmentOrProvinceChange();
    	}
    } else {
    	$(".locality_div").css("display", "none");
    }
}

function _checkSchoolsInput(input) {
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
		$("#school_not_found_div").css("display", "none");
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
		askForSchools(province, department);
	} else {
		$("#school_input").prop("disabled", true);
		$("#school_input").prop("placeholder", "primero seleccionar provincia y departamento");
		$("#locality_input").prop("disabled", true);
		$("#locality_input").prop("placeholder", "primero seleccionar provincia y departamento");
	}
	$("#school_input").val("");
	$("#locality_input").val("");
}

function isDatalistValid(datalist_id) {
	var datalist = document.getElementById(datalist_id);
	var input_val = document.getElementById(datalist_id + "_input").value;
	var options;
	if (datalist_id == "school") {
		options = $( "#school_input" ).autocomplete("option", "source");
	} else {
		options = datalist.options;
	}
	var optionFound = false;
	for (var j = 0; j < options.length; j++) {
		var val;
		if (datalist_id == "school") {
			val = options[j];
		} else {
			val = options[j].value
		}
		if (input_val == val) {
			optionFound = true;
			break;
		}
	}
	return optionFound;
}


$(document).ready(function(){
	
	if (get_current_page_name_without_extension()=="register" ){
		append_user_objects_for_input();
		$("#department_input").prop("disabled", true);
		$("#locality_input").prop("disabled", true);
		$("#school_input").prop("disabled", true);
		$("#department_input").placeholder = "primero seleccionar provincia";
		$("#locality_input").prop("placeholder", "primero seleccionar provincia y departamento");
		$("#school_input").prop("placeholder", "primero seleccionar provincia y departamento");
		update_with_country_value($("input[name=country]").val());
		update_with_is_student_value($("input[name='is_student']:checked").val());
	}
});

/* COMENTADO POR SI QUEREMOS SELECT
function addSelect(schools){
	for(school of schools) {
		$('#select').append($('<option>', {value:school, text:school}));
	}
}*/

function setSchoolsOptions(schools){
	/*
	schools_datalist = document.getElementById("school");
    schools_datalist.innerHTML = "";
	opts = [];
    for(school of schools) {
		opts.push(`<option>${school}</option>`);
    }
	schools_datalist.innerHTML = opts.join("\n");
	*/
	$( "#school_input" ).autocomplete({ source: schools });

}

function get_all_schools(province, department) {
	return $.getJSON( "./jsons/provincias/"+province.toUpperCase()+"/"+department+"_escuelas.json", x => x);
}

function askForSchools(province, department) {
	get_all_schools(province, department).then(x => {
		setSchoolsOptions(x);
		$("#school_not_found_div").css("display", "inline-flex");
	});
	/*
	get_schools_matching_request(province, department, txt).then(x => {
		setSchoolsOptions(x);
		$("#school_not_found_div").css("display", "inline-flex");
	});
	*/
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
	$.getJSON( "./jsons/provincias/"+province.toUpperCase()+"/"+department+"_localidades.json", setLocationOptions);
}

