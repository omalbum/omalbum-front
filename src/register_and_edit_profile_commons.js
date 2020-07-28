$(document).ready(function() {
	//append_user_objects_for_input();
});

function append_user_objects_for_input() {
	$("#append_mail").append($('<input class="input_inside_form" id="email_input" type="text" name="email" placeholder="dirección de email">'));
	$("#append_name").append($('<input class="input_inside_form" id="name_input" type="text" name="name" placeholder="nombres">'));
	$("#append_last_name").append($('<input class="input_inside_form" id="last_name_input" type="text" name="last_name" placeholder="apellidos">'));
	for (var obj of get_jquery_birth_date_objects()){
		$("#append_birth_date").append(obj);
	}
	for (var obj of get_jquery_gender_objects()){
		$("#append_gender").append(obj);
	}
	$('input[type=radio][name=gender]').change(function() {
	    if (this.value == 'otro') {
	        $("#gender_other_input").prop("disabled", false);
	        $("#gender_other_input").focus();
	    } else {
	    	$("#gender_other_input").prop("disabled", true);
	    }
	});
	$("#append_country").append($('<input id="country_input" type="text" list="country" name="country" placeholder="país de residencia" onchange="event_updated_country(this);" value="Argentina">'));
	$("#append_country").append($('<datalist id="country">'));
	$("#append_is_student").append($('<span><input type="radio" id="is_student_yes" name="is_student" checked value="true" onchange="event_updated_student(this);">Sí</span>'));
	$("#append_is_student").append($('<span><input type="radio" id="is_student_no" name="is_student" value="false" onchange="event_updated_student(this);">No</span>'));
	$("#append_school_year").append($('<input class="input_inside_form" type="number" id="school_year_input" name="school_year" placeholder="contando desde primer grado de primaria">'));
	$("#append_is_teacher").append($('<span><input type="radio" id="is_teacher_yes" name="is_teacher" value="true" onchange="event_updated_teacher(this);">Sí</span>'));
	$("#append_is_teacher").append($('<span><input type="radio" id="is_teacher_no" name="is_teacher" value="false" onchange="event_updated_teacher(this);">No</span>'));
	$("#append_province").append($('<input autocomplete="off" id="province_input" type="text" onchange="reset_departments()" list="province" name="province" placeholder="provincia">'));
	$("#append_province").append($('<datalist id="province"></datalist>'));
	$("#append_department").append($('<input id="department_input" onchange="onDepartmentOrProvinceChange()" type="text" list="department" name="department" placeholder="departamento o partido (primero selecciona provincia)">'));
	$("#append_department").append($('<datalist id="department"></datalist>'));
	$("#append_locality").append($('<input id="locality_input" type="text" name="location" placeholder="localidad" list="locality">'));
	$("#append_locality").append($('<datalist id="locality"></datalist>'));
	for (var obj of get_jquery_school_objects()){
		$("#append_school").append(obj);
	}
	$(".input_inside_form").on("keyup", function(e){
		if (e.keyCode == 13) {
			$(this).closest("form").find("input[type='button']").click();
			$(this).closest("form").find("button").click();
		}
	});
	setCountries();
	province_selector();
}

function get_jquery_birth_date_objects() {
	var objs = []
	var div1 = $('<div style="display: -webkit-inline-box;">');
	var day_select = $("<select id='day_input' name='birth_date_day'>");
	for (var i=1; i<=31; i++){
		day_select.append($("<option>").val(i.toString().padStart(2, 0)).text(i));
	}
	div1.append(day_select);
	var month_select = $("<select id='month_input' name='birth_date_month'>");
	var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
				"Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	for (var i=1; i<=12; i++){
		month_select.append($("<option>").val(i.toString().padStart(2, 0)).text(meses[i-1]));
	}
	div1.append(month_select);
	var year_select = $("<select id='year_input' name='birth_date_year'>");
	for (var i=parseInt((new Date()).getFullYear()) - 2; i>=1911; i--){
		year_select.append($("<option>").val(i.toString()).text(i.toString()));
	}
	div1.append(year_select);
	objs.push(div1);
	return objs;
	// $("#append_birth_date").append($('<input id="birth_date_input" type="date" name="birth_date" placeholder="fecha de nacimiento">'));
}

function get_jquery_school_objects() {
	var objs = [];
	var div1 = $('<div class="stretch">');
	div1.append($('<input id="school_input" type="text" list="school" name="school" placeholder="escuela" >'));
	div1.append($('<datalist id="school"></datalist>'));
	objs.push(div1);
	var div2 = $('<div id="school_not_found_div" style="display: none; inline-size: -webkit-fill-available">');
	div2.append($('<input id="school_not_found_checkbox" type="checkbox" style="display: flex;" onclick="schoolNotFoundClick(this)">'));
	div2.append($('<label>No encuentro mi escuela</label>'));
	div2.append($('<input id="written_school_name" placeholder="nombre de tu escuela" style="display: none">'));
	objs.push(div2);
	return objs;	
}

function get_jquery_gender_objects() {
	var objs = [];
	objs.push($('<input type="radio" id="femenino" name="gender" value="femenino">'));
	objs.push($('<label for="femenino">Femenino</label><br>'));
	objs.push($('<input type="radio" id="masculino" name="gender" value="masculino">'));
	objs.push($('<label for="masculino" style="">Masculino</label><br>'));
	objs.push($('<input type="radio" id="prefiero_no_responder" name="gender" value="prefiero no responder">'));
	objs.push($('<label for="prefiero_no_responder">Prefiero no responder</label><br>'));
	objs.push($('<input type="radio" id="otro" name="gender" value="otro">'));
	objs.push($('<label for="otro">Otro:</label>'));
	objs.push($('<input type="text" id="gender_other_input" style="" disabled></input><br>'));
	return objs;
}