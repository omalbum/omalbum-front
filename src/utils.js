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
        if(elem.name) {
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

function padding_number_in_series(n){
	return n.toString().padStart(4, '0');

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
