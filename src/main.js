function create_header_button(link, text, clsName) {
	var link_object = document.createElement("a");
	link_object.href = link;
	link_object.className = clsName;
	link_object.appendChild(document.createTextNode(text));
	return link_object;
}

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

			nav.appendChild(create_header_button("index.html", "inicio", null));
			nav.appendChild(create_header_button("problemas.html", "problemas", null));
			nav.appendChild(create_header_button("login.html", "login", "logged-out"));
			nav.appendChild(create_header_button("register.html", "register", "logged-out"));

			var profile = create_header_button("profile.html", "profile ", "logged-in")
			var profile_em = document.createElement("em");
			profile_em.className = "fill-user_name";
			profile.appendChild(profile_em);
			nav.appendChild(profile);
			
			var logout = create_header_button("", "logout", "logged-in");
			logout.onclick = function() {
				do_logout();
			}
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
