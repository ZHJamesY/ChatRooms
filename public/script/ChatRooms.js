$(document).ready(function(){

    console.log("refreshed");

    // get elements
    const chatLog = document.getElementById('chat_log');
    const createRoom = document.getElementById('createRoomElement');
    const joinRoom = document.getElementById('joinRoomElement');
    const chat = document.getElementById('chatElement');
    const chatInput = document.getElementById('messageInput');
    const chatRoomTitle = document.getElementById('chatRoomTitle');
    const username = document.getElementById('profile_name').innerHTML;

    // if createRoom doesn't have class 'hidden', add attribute else remove
    if(!$(createRoom).hasClass('hidden'))
    {
        const roomIDinput = document.getElementById('roomID');
        roomIDinput.setAttribute('required','required');
    }
    else
    {
        const roomIDinput = document.getElementById('roomID');
        roomIDinput.removeAttribute('required');
    }

    // if chat doesn't have class 'hidden' but create, do create connection
    if(!$(chat).hasClass('hidden') && $(chat).hasClass('create')) 
    {
        console.log("enter create connections")

        // get room id from query parameter
        const roomID = new URLSearchParams(window.location.search).get('roomID');

        // connect to the server
        const socket = io();

        // create and join room
        socket.emit('createRoom', {
            roomID: roomID,
            username: username
        });

        // chat room title + room id
        chatRoomTitle.innerHTML = 'Chat Room: ' + roomID;

        // send a message to the server
        chatInput.addEventListener('keydown', function(event){
            const keyCode = event.which || event.keyCode;
        
            // if === enter key and != shift key, send message
            // shift + enter keys go to new line
            if(keyCode === 13 && !event.shiftKey) 
            {
              // prevent default behaviour: new line
              event.preventDefault();
              sendMessage(roomID, username, chatInput, socket)
            }
        });

        socket.on('message', function(data){
            console.log("message is: ", data);
            addMessageToLog(chatLog, data);
        });

    }

    // collect current room list from server if join room option clicked
    if(!$(joinRoom).hasClass('hidden')) 
    {
        console.log("enter view room list")

        // connect to the server
        const socket = io();

        socket.on('roomList', function(data){
            console.log("current rooms length: ", data.length);

            if(data.length > 0)
            {
                const container = document.getElementById('roomListContainer');

                for(let i = 0; i < data.length; i++)
                {
                    // create form element
                    let form = document.createElement('form');
                    form.className = 'text-center form';
                    form.method = 'post';
                    form.action = '/joinRoom';
                    // append form to container
                    container.appendChild(form);

                    // create input element
                    let input1 = document.createElement('input');
                    input1.type = 'hidden';
                    input1.name = 'username';
                    input1.value = username;
                    input1.readOnly = true;
                    // append input to form
                    form.appendChild(input1);

                    // create input element
                    let input2 = document.createElement('input');
                    input2.type = 'text';
                    input2.name = 'roomID';
                    input2.value = data[i];
                    input2.className = 'roomList align-middle text-center';
                    // append input to form
                    form.appendChild(input2);

                    // create button element
                    let button = document.createElement('button');
                    button.className = 'btn btn-dark';
                    button.innerHTML = 'Join';
                    // append button to form
                    form.appendChild(button);

                    // create hr element
                    let hr = document.createElement('hr');
                    form.appendChild(hr);
                }
            }
        });
    }

    // if chat doesn't have class 'hidden' but join, do join connection
    if(!$(chat).hasClass('hidden') && $(chat).hasClass('join')) 
    {
        console.log("enter join connections");

        // get room id from query parameter
        const roomID = new URLSearchParams(window.location.search).get('roomID');

        // connect to the server
        const socket = io();

        socket.emit('joinRoom', {
            roomID: roomID,
            username: username
        });

        // chat room title + room id
        chatRoomTitle.innerHTML += ' ' + roomID;

        // send a message to the server
        chatInput.addEventListener('keydown', function(event){
            const keyCode = event.which || event.keyCode;
        
            // if === enter key and != shift key, send message
            // shift + enter keys go to new line
            if(keyCode === 13 && !event.shiftKey) 
            {
                // prevent default behaviour: new line
                event.preventDefault();
                sendMessage(roomID, username, chatInput, socket)
            }
        });

        socket.on('message', function(data){
            console.log("message is: ", data);
            addMessageToLog(chatLog, data);
        });
    }
});

// add a message to the chat log
function addMessageToLog(chatLog, message) 
{
    chatLog.value += `${message}\n`;
}

function sendMessage(roomID, username, chatInput, socket)
{
    if(chatInput.value != '')
    {
        socket.emit('message', {
            roomID: roomID,
            username: username,
            message: chatInput.value
        });
        chatInput.value = '';
    }
}
