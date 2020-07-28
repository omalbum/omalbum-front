function create_header_button(link, text, clsName, objId) {
	var link_object = document.createElement("a");
	link_object.href = link;
	link_object.id = objId;
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
			img.src = "./assets/OMAlbum-Logo-Simple.svg";
			linkoma.appendChild(img);
			var omalbum = document.createElement("span");
			omalbum.className = "h1";
			omalbumName = document.createElement("a");
			omalbumName.href=".";
			omalbumName.style = "margin: 0; font-size: 1.5rem;  align-items: center; text-decoration : none;font-family: 'Righteous';";
			omalbumName.innerHTML = "&nbsp;OMA<span style=\"color:#0096da;font-size: 1.5rem;\">LBUM</span>";
			omalbum.appendChild(omalbumName);
			span.appendChild(omalbum);

			nav.appendChild(create_header_button(".", "inicio", null, "inicio_nav"));
			nav.appendChild(create_header_button("FAQ", "info", "", "faq_nav"));
			nav.appendChild(create_header_button("problemas", "problemas", null, "problemas_nav"));
			nav.appendChild(create_header_button("login", "ingresar", "logged-out", "login_nav"));
			nav.appendChild(create_header_button("register", "registrarse", "logged-out", "registrarse_nav"));

			var profile = create_header_button("profile", "perfil ", "logged-in", "perfil_nav")
			var profile_em = document.createElement("em");
			profile_em.className = "fill-user_name";
			profile.appendChild(profile_em);
			nav.appendChild(profile);
			
			var logout = create_header_button(".", "salir", "logged-in", "salir_nav");
			logout.onclick = function() {
				do_logout();
			}
			nav.appendChild(logout);
		}
	}
}

function create_footer(){
	document.getElementById("footer").innerHTML=`
<div class="copyright">
	 &copy;&nbsp;2020&nbsp;<a href="http://oma.org.ar">Olimpíada Matemática Argentina</a>
</div>
<div class="socialNetworks">
	<a href="https://www.instagram.com/omalbum.ok" target="_blank" title="Seguinos en Instagram!" class="fa fa-instagram"></a>
</div>
`;
}

function border_active_tab() {
	var page_name_to_obj_id = {
		"FAQ": "faq_nav",
		"problemas": "problemas_nav",
		"login": "login_nav",
		"register": "registrarse_nav",
		"profile": "perfil_nav",
		"inicio": "inicio_nav",
		"": "inicio_nav",
	};
	var obj_id = page_name_to_obj_id[get_current_page_name()];
	if (obj_id != undefined) {
		$("#" + obj_id).addClass("active-tab");
	}
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
    		if ($(this).find(".click_if_enter_on_form").length > 0) {
    			$(this).find(".click_if_enter_on_form").click();
    			return false;
    		}
    	}
	});
    $(".input_inside_form").on("keyup", function(e){
    	if (e.keyCode == 13) {
    		$(this).find(".click_if_enter_on_form").click();
    		return false;
    	}
    });
    border_active_tab();
}

window.onload = init;
