function onEditProfileClick() {
	if ($("#edit_profile_button").text() == "Guardar") {
		var payload = extract_data(document.getElementById("edit_profile_button").closest("form"));
		console.log(payload);
		clear_notifications();
		update_user_request(payload).then(x => {
			if (x.code) {
				sessionStorage.setItem("reloading", true);
				sessionStorage.setItem("notif", "notification urgent");
				sessionStorage.setItem("notif_text", "Error al intentar modificar");
				sessionStorage.setItem("notif_code", err.code);
				//notify("notification urgent", "Error al intentar modificar", err.code);
			} else {
				new_user_data = user();
				for (key in x) {
					new_user_data[key] = x[key];
				}
				localStorage.setItem('user', JSON.stringify(new_user_data));
				sessionStorage.setItem("reloading", true);
				sessionStorage.setItem("notif", "notification good");
				sessionStorage.setItem("notif_text", "Perfil guardado!");
				sessionStorage.setItem("notif_code", "");
				//notify("notification good", "Perfil guardado!", "");
			}
			location.reload();
		}).catch(err => {
			sessionStorage.setItem("reloading", true);
			sessionStorage.setItem("notif", "notification urgent");
			sessionStorage.setItem("notif_text", "No se pudieron guardar los cambios");
			sessionStorage.setItem("notif_code", err.code);
			location.reload();
			//notify("notification urgent", "No se pudieron guardar los cambios", err.code);
		});
	} else {
		$(".changeable").each(function(){
			var txt = $(this).text();
			$(this).text("");
			$(this).append($("<input name='" + $(this).prop("id") + "'>").val(txt));
		});
		$("#edit_profile_button").text("Guardar");
	}
}
