function notify(urgency, title, text) {
    var main = document.getElementsByTagName("main")[0];
    // var body = document.getElementsByTagName("body")[0];
    main.insertAdjacentHTML('beforebegin', `<div class="${urgency}"><h1>${title}</h1><p>${text}</p><div>`)
}

