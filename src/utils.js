function date_string(date, time) {
    var offset = new Date().getTimezoneOffset();
    if(offset >= 0) tz = "-"
    else {
        tz = "+";
        offset = -offset;
    }
    tz += (offset/60).toString().padStart(2, '0') + ":" + (offset%60).toString().padStart(2, '0');
    return date + "T" + time + ":00" + tz;
}

function html_escape(text) {
    var text_node = document.createTextNode(text);
    return text_node.textContent;
}

function fill_with(class_name, action) {
    for(e of document.getElementsByClassName(class_name)) {
        e.innerHTML = action(e);
    }
}

function extract_data(form) {
    var data = {};
    for(elem of Array.from(form.getElementsByTagName("input")).concat(Array.from(form.getElementsByClassName("input")))) {
        if(elem.name && elem.offsetParent) {
            if(elem.type == "checkbox") {
                value = elem.checked;
            } else {
                value = elem.value;
            }
            data[elem.name] = value
        }
    }
    return data;
}


function get_nice_date_to_show(date){
	date = new Date(date);
	ret = get_day_string(date) + " " + date.getDate().toString() + " de " + get_month_string(date);
	ret += " (faltan " + get_date_diff_from_now(date) + ")";
	return ret;
}

function get_date_diff_from_now(date) {
	var now = new Date();
	var seconds = parseInt(Math.abs(now-date) / 1000);
	if (seconds < 60){
		return seconds.toString() + " segundos";
	}
	var minutes = parseInt(seconds / 60);
	if (minutes < 60){
		return minutes.toString() + " minutos";
	}
	var horas = parseInt(minutes / 60);
	if (horas < 24*3){
		return horas.toString() + " horas";
	}
	return (parseInt(horas / 24)).toString() + " dias";
}

function get_month_string(date){
	var month = date.getMonth();
	if (month == 0){
		return "Enero";
	}
	if (month == 1){
		return "Febrero";
	}
	if (month == 2){
		return "Marzo";
	}
	if (month == 3){
		return "Abril";
	}
	if (month == 4){
		return "Mayo";
	}
	if (month == 5){
		return "Junio";
	}
	if (month == 6){
		return "Julio";
	}
	if (month == 7){
		return "Agosto";
	}
	if (month == 8){
		return "Septiembre";
	}
	if (month == 9){
		return "Octubre";
	}
	if (month == 10){
		return "Noviembre";
	}
	if (month == 11){
		return "Diciembre";
	}
}

function get_day_string(date){
	var day_of_week = date.getDay();
	if (day_of_week == 0){
		return "Domingo";
	}
	if (day_of_week == 1){
		return "Lunes";
	}
	if (day_of_week == 2){
		return "Martes";
	}
	if (day_of_week == 3){
		return "Miercoles";
	}
	if (day_of_week == 4){
		return "Jueves";
	}
	if (day_of_week == 5){
		return "Viernes";
	}
	if (day_of_week == 6){
		return "Sabado";
	}
}

function get_problem_code_to_show(p){
	if(p.is_draft){
		return `#${p.series}???`;
	}
	return `#${p.series}${padding_number_in_series(p.number_in_series)}`;
}


function padding_number_in_series(n){
	return n.toString().padStart(3, '0');

}


function compare_problems (p,q){
	// horribleee
	if (p["series"] <= q["series"]){
		if (p["series"] == q["series"]){
			if (p["number_in_series"]<q["number_in_series"]){
				return -1;
			}
			if (p["number_in_series"]==q["number_in_series"]){
				return 0;
			}
			return 1;
		}
		return -1	
	}
	return 1;
}

