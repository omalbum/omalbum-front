function create_header_nav() {
	var navs = document.getElementsByClassName("header-nav");
	if (navs.length > 0) {
		for (nav of navs) {
			var span = document.createElement("span");
			nav.appendChild(span);
			span.className = "head";
			var img = document.createElement("img");
			img.src = "oma-bg.svg";
			span.appendChild(img);
			var omalbum = document.createElement("span");
			omalbum.className = "h1";
			omalbum.appendChild(document.createTextNode("OMAlbum"));
			span.appendChild(omalbum);
			var inicio = document.createElement("a");
			inicio.href = "index.html";
			inicio.appendChild(document.createTextNode("inicio"));
			nav.appendChild(inicio);
			
			var problemas = document.createElement("a");
			problemas.href = "problemas.html";
			problemas.appendChild(document.createTextNode("problemas"));
			nav.appendChild(problemas);
			
			var login = document.createElement("a");
			login.href = "login.html";
			login.className = "logged-out";
			login.appendChild(document.createTextNode("login"));
			nav.appendChild(login);
			
			var register = document.createElement("a");
			register.href = "register.html";
			register.className = "logged-out";
			register.appendChild(document.createTextNode("register"));
			nav.appendChild(register);
			
			var profile = document.createElement("a");
			profile.href = "profile.html";
			profile.className = "logged-in";
			profile.appendChild(document.createTextNode("profile "));
			var profile_em = document.createElement("em");
			profile_em.className = "fill-user_name";
			profile.appendChild(profile_em);
			nav.appendChild(profile);
			
			var logout = document.createElement("a");
			logout.href = "";
			logout.onclick = function() {
				do_logout();
			}
			logout.className = "logged-in";
			logout.appendChild(document.createTextNode("logout"));
			nav.appendChild(logout);
		}
	}
}

function init() {
	create_header_nav();
    if(is_logged_in()) {
        login_update();
    } else {
        logout_update();
    }
    insert_problems();
    province_selector();
}

window.onload = init;
