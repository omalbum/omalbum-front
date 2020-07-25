function onEditProfileClick() {
	if ($("#edit_profile_button").text() == "Guardar") {
		var payload = get_register_payload(document.getElementById("edit_profile_button").closest("form"));
		payload.user_name = user()["user_name"];
		var validations = custom_validate_register_payload(payload,
														$("#country_input").val() == "Argentina",
														($("#country_input").val() == "Argentina" && isStudent()) || isTeacher());
		validations = validations.concat(validate_register_payload(payload, false));
		if (isStudent() && $("input[name='is_teacher']:checked").val() == "true"){
			validations.push({ field:"Docente o estudiante?", error: "Seleccionaste ambas" });
		}
		clear_notifications();
		if (validations.length > 0){
			feedback_register_validation_fails(validations);
			return;
		}
		update_user_request(payload).then(x => {
			if (x.code) {
				clear_notifications();
				notify("notification urgent", "Error al intentar modificar", html_escape(x.code) || "Error desconocido");
				scrollToTop();
			} else {
				new_user_data = user();
				for (key in x) {
					good_case_key = key.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "")
					new_user_data[good_case_key] = x[key];
				}
				localStorage.setItem('user', JSON.stringify(new_user_data));
				sessionStorage.setItem("reloading", true);
				sessionStorage.setItem("notif", "notification good");
				sessionStorage.setItem("notif_text", "Perfil guardado!");
				sessionStorage.setItem("notif_code", "");
				location.reload();
			}
		}).catch(err => {
			var msg = html_escape(err.code) || "Error desconocido"
			if (err.code == "wrong_password") {
				msg = "Contraseña incorrecta";
			}
			clear_notifications();
			notify("notification urgent", "No se pudieron guardar los cambios", msg);
			scrollToTop();
		});
	} else {
		$(".changeable").each(function(){
			var txt = $(this).text();
			$(this).text("");
			/*var field = $(this).prop("id").substr(0, $(this).prop("id").length-3);
			if (field == "country") {
				$(this).append($("<input name='country' list='country' >").val(txt));
				var datalist = $("<datalist id='country'>");
				for (country of all_countries) {
					datalist.append($("<option>").val(country));
				}
				$(this).append(datalist);
			} else if(field == "gender") {
				$("#gender_td_datalist").css("display", "block");
				$("#gender_td").css("display", "none");
			} else {
				$(this).append($("<input name='" + field + "'>").val(txt));
			}*/
		});
		append_user_objects_for_input();
		fill_values_with_user_values();
		$("#check_password_tr").css("display", "");
		$("#edit_profile_button").text("Guardar");
	}
}

function is_other_gender(gender) {
	return gender != "masculino" && gender != "femenino" && gender != "prefiero no responder";
}

function get_input_date_format(date_backend) {
	var d = new Date(date_backend);
	return  d.getUTCFullYear().toString() + "-" + (1 + d.getUTCMonth()).toString().padStart(2, '0') + "-" + d.getUTCDate().toString().padStart(2, '0');
}

function fill_values_with_user_values() {
	$("#email_input").val(user()["email"]);
	$("#name_input").val(user()["name"]);
	$("#last_name_input").val(user()["last_name"]);
	var user_birth_date = new Date(user()["birth_date"]);
	$("#birth_date_input").val(get_input_date_format(user_birth_date));
	if (is_other_gender(user()["gender"])) {
		$("#otro").prop("checked", true);
		$("#gender_other_input").prop("disabled", false);
	    $("#gender_other_input").val(user()["gender"]);
	} else {
		if (user()["gender"] == "prefiero no responder"){
			$("#prefiero_no_responder").prop("checked", true);
		} else{
			$("#" + user()["gender"]).prop("checked", true);
		}
	}
	$("#country_input").val(user()["country"]);
	if(isFromArg()){
		reset_departments();
	}
	if (user()["is_student"]) {
		$("#is_student_yes").prop("checked", true);
	} else {
		$("#is_student_no").prop("checked", true);
	}
	update_with_is_student_value(user()["is_student"] ? "true" : "false");
	if (user()["is_teacher"]) {
		$("#is_teacher_yes").prop("checked", true);
	} else {
		$("#is_teacher_no").prop("checked", true);
	}
	update_with_is_teacher_value(user()["is_teacher"] ? "true" : "false");
	$("#school_year_input").val(user()["school_year"] || "");
	if (user()["province"]) {
		$("#province_input").val(user()["province"] || "");
		reset_departments();
		onDepartmentOrProvinceChange();
	}
	if (user()["department"]) {
		$("#department_input").val(user()["department"] || "");
		$("#department_input").prop("disabled", false);
		onDepartmentOrProvinceChange();
		$("#locality_input").prop("disabled", false);
		askForLocations(user()["province"], user()["department"]);
		askForSchools(user()["province"], user()["department"]);
	}
	$("#locality_input").val(user()["location"] || "");
	if(user()["school"]) {
		$("#school_input").val(user()["school"]);
		$("#school_input").prop("disabled", false);
		get_all_schools(user()["province"], user()["department"]).then(x => {
			if (!x.includes(user()["school"])){
				$("#school_input").val("");
				$("#school_not_found_checkbox").prop("checked", true);
				$("#written_school_name").css("display", "");
				$("#written_school_name").prop("disabled", false);
				$("#written_school_name").val(user()["school"]);
			}
		});
	}
}

$(document).ready(function(){
	if ( get_current_page_name_without_extension() == "profile" ){
		var display = "none";
		if(is_logged_in() && (user()["country"] == "Argentina" || user()["is_teacher"])) {
			display = "";
		}
		for (var elem of document.getElementsByClassName("locality_div")) {
			$(elem).css("display", display);
		}
		if(is_logged_in() && !user()["school"] ) {
			$("#school_div").css("display", "none");
		}
		display = "none";
		if(is_logged_in() && user()["is_student"]) {
			display = "";
		}
		for (var elem of document.getElementsByClassName("if-student")) {
			$(elem).css("display", display);
		}
	}
});

function onEditPasswordClick(btn) {
	if ($("#only_asterisks").css("display") != "none") {
		$("#only_asterisks").css("display", "none");
		$("#current_password").css("display", "");
		$("#new_password").css("display", "");
		$("#new_password_2").css("display", "");
	} else {
		payload = extract_data(btn.closest("form"));
		if (payload.new_password != payload.new_password_2) {
			clear_notifications();
			notify("notification urgent", "Las contraseñas no coinciden", "Asegurate de repetir correctamente la nueva contraseña");
			scrollToTop();
			return;
		}
		if (!is_valid_password(payload.new_password)){
			clear_notifications();
			notify("notification urgent", "Contraseña no válida", "La contraseña debe tener entre 6 y 20 caracteres");
			scrollToTop();
			return;
		}
		change_user_password(user()["user_id"], payload.current_password, payload.new_password).then(x => {
			clear_notifications();
			notify("notification good", "Contraseña cambiada!", "La contraseña fue actualiza");
			scrollToTop();
			$("input[name='current_password']").val("");
			$("input[name='new_password']").val("");
			$("input[name='new_password_2']").val("");
			$("#new_password").css("display", "none");
			$("#new_password_2").css("display", "none");
			$("#only_asterisks").css("display", "");
			$("#current_password").css("display", "none");
		}).catch(err => {
			if (err.code == "incorrect_old_password"){
				clear_notifications();
				notify("notification urgent", "Contraseña incorrecta", "La contraseña actual que pusiste es incorrecta");
				scrollToTop();
			}
		});
	}
}
