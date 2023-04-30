$(document).ready(function(){
    // get elements
    const username_signin = document.getElementById("signinUsername");
    const password_signin = document.getElementById("signinPassword");

    const username_signup = document.getElementById("signupUsername");
    const password_signup = document.getElementById("signupPassword");

    // assign attribute required to username and password field for sig in page
    if (username_signin.classList.contains('required')) {
        // add required attributes to elements
        username_signin.setAttribute('required','required');
        password_signin.setAttribute('required','required');
    }

    // assign attribute required to username and password field for sign up page
    if (username_signup.classList.contains('required')) {
        // add required attributes to elements
        username_signup.setAttribute('required','required');
        password_signup.setAttribute('required','required');
    }

});
