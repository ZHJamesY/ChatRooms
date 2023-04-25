$(document).ready(function(){
    // get elements
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (username.classList.contains('required')) {
        // add required attributes to elements
        username.setAttribute('required','required');
        password.setAttribute('required','required');
    }
});
