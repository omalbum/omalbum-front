function recuperar_password(btn) {
	payload = extract_data(btn.closest("form"));
	clear_notifications();
	password_reset_request(payload).then(x => {
		notify("notification good", "Contraseña restaurada",
				"Revisá tu casilla de email! (si no llega en unos minutos, revisá la carpeta de \"Spam\" o \"No deseados\")");
	}).catch(err => {
		if (err.code == "email_not_found") {
			notify("notification urgent", "El email es incorrecto", "Asegurate de haber escrito el email con el cual te registraste");
		} else {
			notify("notification urgent", "Ocurrió un error", "Volvé a intentar y si sigue persistiendo el error escribinos a omalbum.ok@gmail.com");
		}
	});
}
