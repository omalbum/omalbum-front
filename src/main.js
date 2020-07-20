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
			var linkoma =document.createElement("a");
			linkoma.href=".";
			linkoma.style = "margin: 0; padding: 0px;"
			span.appendChild(linkoma);
			var img = document.createElement("img");
			img.src = "OMAlbum-Logo-Simple.svg";
			linkoma.appendChild(img);
			var omalbum = document.createElement("span");
			omalbum.className = "h1";
			omalbumName = document.createElement("a");
			omalbumName.href=".";
			omalbumName.style = "margin: 0; font-size: 1.5rem;  align-items: center; text-decoration : none;font-family: 'Righteous';";
			omalbumName.innerHTML = "OMA<span style=\"color:#0096da;font-size: 1.5rem;\">LBUM</span>";
			omalbum.appendChild(omalbumName);
			span.appendChild(omalbum);

			nav.appendChild(create_header_button("index.html", "inicio", null));
			nav.appendChild(create_header_button("problemas.html", "problemas", null));
			nav.appendChild(create_header_button("login.html", "ingresar", "logged-out"));
			nav.appendChild(create_header_button("register.html", "registrarse", "logged-out"));

			var profile = create_header_button("profile.html", "perfil ", "logged-in")
			var profile_em = document.createElement("em");
			profile_em.className = "fill-user_name";
			profile.appendChild(profile_em);
			nav.appendChild(profile);
			
			var logout = create_header_button("", "salir", "logged-in");
			logout.onclick = function() {
				do_logout();
			}
			nav.appendChild(logout);
		}
	}
}

function create_footer(){
	document.getElementById("footer").innerHTML="&copy; 2020 <a href=\"http://oma.org.ar\" style=\"font-size:1.0rem;padding-right:0px;\" >Olimpíada Matemática Argentina</a>";
}

function init() {
	create_footer();
	create_header_nav();
    if(is_logged_in()) {
        login_update();
    } else {
        logout_update();
    }
    insert_problems();
	insert_problems_admin();
    register_init();
    insert_index_problems();
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
    	// No anda pero la pantalla deberia ser chica: window.scrollTo(0, 0);
    	notify(sessionStorage.getItem("notif"), sessionStorage.getItem("notif_text"), sessionStorage.getItem("notif_code"));
        sessionStorage.removeItem("reloading");
        sessionStorage.removeItem("notif");
        sessionStorage.removeItem("notif_text");
        sessionStorage.removeItem("notif_code");
    }
    $("form").keypress(function(e) {
    	if (e.which == 13) {
    		$(this).find("input[type='button']").click();
    		return false;
    	}
	});
    $(".input_inside_form").on("keyup", function(e){
    	if (e.keyCode == 13) {
    		$(this).closest("form").find("input[type='button']").click();
    		$(this).closest("form").find("button").click();
    	}
    });	
}

window.onload = init;
