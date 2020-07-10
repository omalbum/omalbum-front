function init() {
    if(is_logged_in()) {
        login_update();
    } else {
        logout_update();
    }
    insert_problems();
    province_selector();
}

window.onload = init;
