// import modules
const express = require('express');
require('dotenv').config();
const session = require('express-session');

const app = express();
const dataBase = require('./mongoDB.js');
const {v4:uuidv4} = require('uuid');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function(){
    console.log(`Listening for requests on port ${app.get('port')}.`);
});

const io = require('socket.io')(server);

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
    });
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
    });
});

// sign up page
app.get('/signup', function(request, response){
    const query = request.query;

    response.render('EnterPage',{
        title: "Sign In",
        animationClass: "enter-animation",
        h1Message: "Sign Up",
        signInMethod: "",
        logInMessage: "",
        usernameClass: "required",
        passwordClass: "required",
        signInClass: "hidden",
        signUpMethod: "post",
        signUpClass: "",
        query: query
    });
});


// sign in request
app.post('/login', async function(request, response){
    let username = request.body.username;
    let password = request.body.password;
    const query = request.query;
    const exist = await userExists(username,password);

    // login success if exist == true, else return to login page
    if(exist)
    {        
        // add the username to the array
        request.session[username] = true;

        response.redirect('/ChatRooms?username=' + username)
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
        });
    }
});

// sign up request
app.post('/signup', async function(request, response){
    let username = request.body.username;
    let password = request.body.password;
    const query = request.query;
    const exist = await userExists(username,password);

    // login success if exist == true, else return to login page
    if(!exist)
    {        
        // add the username to the array
        request.session[username] = true;

        const Accounts = dataBase.Accounts;
        // Insert the new account into the database
        const newAccount = new Accounts({
            Username: username,
            Password: password,
        });
        await newAccount.save();

        response.redirect('/ChatRooms?username=' + username)
    }
    else
    {
        response.render('EnterPage',{
            title: "Sign In",
            animationClass: "enter-animation",
            h1Message: "Sign Up",
            signInMethod: "",
            logInMessage: "",
            usernameClass: "required",
            passwordClass: "required",
            signInClass: "hidden",
            signUpMethod: "post",
            signUpClass: "",
            query: query
        });
    }
});

app.get('/ChatRooms', function(request,response){

    // get user name from request
    const username = request.query.username;
    // check if session id exist, else return to login page and display unauthorized message
    if(request.session[username])
    {
        response.render('ChatRooms', {
            title: "ChatRooms",
            username: username,
            chatClass: "hidden",
            createRoomClass: "hidden",
            joinRoomClass: "hidden"
        });
    }
    else
    {
        response.redirect('/login?error=unauthorized')
    }
});

app.get('/createRoom', function(request, response){

    // get user name from request
    const username = request.query.username;

    // check user session id
    if(request.session[username])
    {
        response.render('ChatRooms', {
            title: "ChatRooms",
            username: username,
            chatClass: "hidden",
            createRoomClass: "",
            joinRoomClass: "hidden"
        });
    }
    else
    {
        response.redirect('/login?error=unauthorized')
    }
});

app.get('/joinRoom', function(request, response){

    // get user name from request
    const username = request.query.username;
    // check user session id
    if(request.session[username])
    {
        response.render('ChatRooms', {
            title: "ChatRooms",
            username: username,
            chatClass: "hidden",
            createRoomClass: "hidden",
            joinRoomClass: ""
        });
    }
    else
    {
        response.redirect('/login?error=unauthorized')
    }
});

app.post('/createRoom', function(request, response){
    let username = request.body.username;
    let roomID = request.body.roomID;

    console.log("in post create username = ", username);

    response.redirect('/chat?username='+ username + '&roomID=' + roomID + '&status=create');
});

app.post('/joinRoom', function(request, response){
    let username = request.body.username;
    let roomID = request.body.roomID;
    response.redirect('/chat?username='+ username + '&roomID=' + roomID + '&status=join');
});

app.get('/chat', function(request, response){
        // get user name from request
        const username = request.query.username;
        // get status from query parameters
        const status = request.query.status;

        console.log("status = ", status);

        // check user session id
        if(request.session[username])
        {
            response.render('ChatRooms', {
                title: "ChatRooms",
                username: username,
                chatClass: status,
                createRoomClass: "hidden",
                joinRoomClass: "hidden"
            });
        }
        else
        {
            response.redirect('/login?error=unauthorized')
        }
});

let roomList = []
let roomIndex = {}
let roomUsers = {}
let User_username = {};
let User_roomID = {};



// start connection
io.on('connection', function(socket){
    console.log('User connected');

    // create room connection
    socket.on('createRoom', function(data){
        // Create room connection if room not exist in roomList, else display msg
        if(!roomList.includes(data.roomID))
        {
            socket.join(data.roomID);
            roomIndex[data.roomID] = roomList.length;
            roomList.push(data.roomID);
            roomUsers[data.roomID] = 1;
            User_roomID[socket.id] = data.roomID;
            User_username[socket.id] = data.username;
            console.log(`Client created room ${data.roomID}`);
            // welcome msg to current user
            socket.emit('message', `(Server): Welcome to chat room ${data.roomID}.`);
        }
        else
        {
            console.log("Room already exists");
        }
    });

    // join room connection
    socket.on('joinRoom', function(data){
        if(roomList.includes(data.roomID))
        {
            socket.join(data.roomID);
            roomUsers[data.roomID] += 1;
            User_roomID[socket.id] = data.roomID;
            User_username[socket.id] = data.username;
            // welcome msg to current user
            socket.emit('message', `(Server): Welcome to chat room ${data.roomID}.`);
            // broadcast msg to users in room except current user
            socket.broadcast.to(data.roomID).emit('message', `(Server): User ${data.username} joined the chat room.`);

        }
    });

    console.log("room list length: ", roomList.length);
    socket.emit('roomList', roomList);

    // disconnect
    socket.on('disconnect', function(){
        // number of users in room - 1
        roomUsers[User_roomID[socket.id]] -= 1;

        // if room users == 0
        if(roomUsers[User_roomID[socket.id]] == 0)
        {
            // remove room id from roomList and index from roomIndex
            roomList.splice(roomIndex[User_roomID[socket.id]], 1);
            delete roomIndex[User_roomID[socket.id]];
        }

        console.log("disconnected username: ", User_username[socket.id]);
        console.log("disconnected room id: ", User_roomID[socket.id])

        socket.broadcast.to(User_roomID[socket.id]).emit('message', `(Server): User ${User_username[socket.id]} left the chat room.`);
        console.log('User disconnected');
    });

    // // message between user
    socket.on('message', function(data){
        
        console.log(`Message from user (${data.username}): ${data.message}`);
        io.to(data.roomID).emit('message', `(${data.username}): ${data.message}`);
    });
});

app.get('/LogOut', function(request,response){
    // get user name from request
    const username = request.query.username;
    request.session[username] = '';
    response.redirect('/EnterPage');
});


