// import modules
const express = require('express');
require('dotenv').config();
const session = require('express-session');

const app = express();
const dataBase = require('./mongoDB.js');
const {v4:uuidv4} = require('uuid');

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log(`Listening for requests on port ${app.get('port')}.`);
});

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(session({
    // generate session id
    genid: () => uuidv4(),

    // save file: false
    resave: false,

    // save parameters: false
    saveUninitialized: false,

    // signature
    secret: 'ChatRooms'
}))

app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

// function checks if user exists and password if provided string is not empty
async function userExists(username,password) {
    let index = 0;
    const accounts = await dataBase.Accounts.find();
    const exists = accounts.some(function(element) {
        if(password == "")
        {
            return element.Username === username;
        }
        else
        {
            return (element.Username === username  && element.Password === password);
        }
    });
    return exists;
}

// enter page
app.get('/', function(request, response){
    const query = request.query;

    response.render('EnterPage',{
        title: "Chat Rooms",
        animationClass: "enter-animation",
        h1Message: "Welcome to Chat Rooms",
        signInMethod: "get",
        logInMessage: "",
        usernameClass: "hidden",
        passwordClass: "hidden",
        signInClass: "",
        signUpMethod: "get",
        signUpClass: "",
        query: query
    })
});

// sign in page
app.get('/login', function(request, response){
    const query = request.query;

    response.render('EnterPage',{
        title: "Sign In",
        animationClass: "enter-animation",
        h1Message: "Sign In",
        signInMethod: "post",
        logInMessage: "",
        usernameClass: "required",
        passwordClass: "required",
        signInClass: "",
        signUpMethod: "",
        signUpClass: "hidden",
        query: query
    })
});

// sign in request
app.post('/login', async function(request, response){
    let username = request.body.username;
    let password = request.body.password;
    const query = request.query;

    const exist = await userExists(username,password);
    if(exist)
    {
        // store user to session id
        request.session.username = username;
        response.redirect('/ChatRooms')
    }
    else
    {
        response.render('EnterPage',{
            title: "Sign In",
            animationClass: "",
            h1Message: "Sign In",
            signInMethod: "post",
            logInMessage: "Username/Password incorrect, try again.",
            usernameClass: "required",
            passwordClass: "required",
            signInClass: "",
            signUpMethod: "",
            signUpClass: "hidden",
            query: query
        })
    }
});

app.get('/ChatRooms', function(request,response){
    if(request.session.username)
    {
        response.render('ChatRooms', {
            title: "ChatRooms"
        })
    }
    else
    {
        response.redirect('/login?error=unauthorized')
        
    }
})

// dataBase.Accounts.find()
//     .then(accounts => {
//     console.log(accounts);
//     });

