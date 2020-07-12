function register_with_validation(payload) {
	validation_failures = validate_register_payload(payload);
	if( validation_failures.length >0 ){
		feedback_register_validation_fails(validation_failures);
		return;
	}
    return register_request(payload).then(() => {
        return login(payload.user_name, payload.password);
    }).catch(err => {
		clear_notifications();
        notify("notification urgent", "Registración Fallida", html_escape(err.code));
    });
}

function register_event(form) {
    payload = extract_data(form.closest("form"));
    payload.school_year = parseInt(payload.school_year);
	return register_with_validation(payload);
}



function feedback_register_validation_fails(validation_failures){
	clear_notifications();
	validation_failures.forEach( x => notify("notification urgent", x.field, x.error) );
}



function province_selector() {
    ele = document.getElementById("province");
    if(ele) {
        for(k in locations) {
            ele.innerHTML += `<option>${k}</option>`
        }
        loc = document.getElementById("department");
        for(k in locations) {
            for(j of locations[k]) {
                loc.innerHTML += `<option>${j}</option>`
            }
        }
    }
}

function reset_departments() {
    console.log("reset departamentos");
    loc = document.getElementById("department");
    tag = document.getElementsByName("province")[0];
    console.log(tag.value);
    loc.innerHTML = ""
    for(j of locations[tag.value]) {
        loc.innerHTML += `<option>${j}</option>`
    }
}

function fillWithSchools() {
	var schools = ["ort 1", "escuelas tecnicas ort 2", "pellegrini", "cnba"];
	var ul = $("#ulSchoolsSearch");
	if (!ul)return;
	for (var school of schools) {
		ul.append('<li class="lisearch">' + school + '</li>');
	}
}

function initializeEscuelas(){
	$(".searchInput").focus(function () {
	    $("#ulSchoolsSearch").show();
	    $("#ulSchoolsSearch").find("li").show();
	});
	$("#searchInputId").blur(function () {
	    $("#ulSchoolsSearch").hide();
	});
	
	$(document).on('click', '.lisearch', function () {
		alert($(this).text());
	    $("#searchInputId").val($(this).text()).blur();
		$("#ulSchoolsSearch").hide();
	    onSelect($(this).text())
	});
	
	$(".searchable ul li").hover(function () {
	    $(this).closest(".searchable").find("ul li.selected").removeClass("selected");
	    $(this).addClass("selected");
	});
}

document.addEventListener("DOMContentLoaded", function(){
  fillWithSchools();
  initializeEscuelas();
});


function filterFunction(that, event) {
    let container, input, filter, li, input_val;
    container = $(that).closest(".searchable");
    input_val = container.find("input").val().toUpperCase();
    $("#ulSchoolsSearch").show();

    if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
        keyControl(event, container)
    } else {
        li = container.find("ul li");
        li.each(function (i, obj) {
        	var idx = 0;
        	for (var chr of $(this).text().toUpperCase()){
        		if (chr == input_val[idx]){
        			idx++;
        		}
        		if (idx == input_val.length) {
        			break;
        		}
        	}
            if (idx == input_val.length) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        container.find("ul li").removeClass("selected");
        setTimeout(function () {
            container.find("ul li:visible").first().addClass("selected");
        }, 100)
    }
}

function keyControl(e, container) {
    if (e.key == "ArrowDown") {

        if (container.find("ul li").hasClass("selected")) {
            if (container.find("ul li:visible").index(container.find("ul li.selected")) + 1 < container.find("ul li:visible").length) {
                container.find("ul li.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
            }

        } else {
            container.find("ul li:first-child").addClass("selected");
        }

    } else if (e.key == "ArrowUp") {

        if (container.find("ul li:visible").index(container.find("ul li.selected")) > 0) {
            container.find("ul li.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
        }
    } else if (e.key == "Enter") {
        container.find("input").val(container.find("ul li.selected").text()).blur();
        onSelect(container.find("ul li.selected").text())
        $("#ulSchoolsSearch").hide();
    }

    container.find("ul li.selected")[0].scrollIntoView({
        behavior: "smooth",
    });
}
