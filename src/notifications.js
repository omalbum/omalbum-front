function get_notifications(){
	return document.getElementById("notifications");
}

function notify(urgency, title, text) {
    var notis = get_notifications();
    // var body = document.getElementsByTagName("body")[0];
    notis.innerHTML+=`<div class="${urgency}"><h1>${title}</h1><p>${text}</p><div>`;
}

function clear_notifications(){
    var notis = get_notifications();
	notis.innerHTML = "";
}
