
function is_nontrivial(s){
	return s!= "";
}

function is_valid_email(s){
	return s.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) != null;
}

function is_valid_user_name(s){
	return is_alphanumeric_without_accents(s);
}

// minusculas mayusculas y numeros
// no vale acentos o espacios
function is_alphanumeric_without_accents(s){
	return s.match(/^[0-9a-zA-Z]+$/)!=null;
}

function is_integer(s){
	return s.toString().match(/^([+-]?[0-9]\d*|0)$/) != null;
}

function is_valid_password(s){
	l = s.length;
	return (6<= l ) && (l<=20);
}

function is_valid_birth_date(s) {
	if (s === "") return false;
	nums = s.split("-");
	return parseInt(nums[0]) > 1920; 
}

function is_valid_country(s) {
	return is_nontrivial(s);
}

function validate_register_payload(payload){
	// to do: agregar todas las validaciones
	var validation_failures = [];
	if(! is_nontrivial(payload["name"]) ){
		validation_failures.push({ field:"Nombre", error: "No puede quedar vacío" });
	}
	if(! is_nontrivial(payload["last_name"]) ){
		validation_failures.push({ field:"Apellido", error: "No puede quedar vacío" });
	}
	if(! is_valid_email(payload["email"]) ){
		validation_failures.push({ field:"Email", error: "Email no válido" });
	}
	if(! is_valid_password(payload["password"]) ){
		validation_failures.push({ field:"Password", error: "Debe tener entre 6 y 20 caracteres." });
	}

	if(! is_valid_user_name(payload["user_name"]) ){
		validation_failures.push({ field:"Nombre de usuario", error: "Solamente puede tener letras minúsculas, mayúsculas y números (sin acentos ni espacios)." });
	}
	
	if(! is_valid_birth_date(payload["birth_date"]) ){
		validation_failures.push({ field:"Fecha de nacimiento", error: "No puede quedar vacía" });
	}
	
	return validation_failures;
}

function validate_create_problem_payload(payload){
	// to do: agregar todas las validaciones
	var validation_failures = [];
	if(! is_nontrivial( payload["statement"] ) ){
		validation_failures.push({ field:"Enunciado", error: "No puede quedar vacío" });
	}
	if(! is_nontrivial( payload["series"] ) ){
		validation_failures.push({ field:"Serie", error: "No puede quedar vacío" });
	}
	if(! is_integer( payload["answer"] ) ){
		validation_failures.push({ field:"Respuesta", error: "Debe ser un entero" });
	}


	return validation_failures;
}

