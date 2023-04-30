# ChatRooms  
This chat application allows users to create/join a chat room and establish real-time communication with other users.   

Access through https://chat-rooms-f9pk.onrender.com/  

Sample accounts:  
&emsp; username: user1, password: user123  
&emsp; username: user2, password: user123  

Run project on your local machine  
1. Clone the repository  
2. Run command npm install for necessary modules/packages  
3. Rename .env_SAMPLE.txt to .env and assign your mongoDB atlas api value to MONGODB_URL
4. Finally start the server with command nodemon  
  
## Features  
This application hosts a [Node.js](https://developer.mozilla.org/en-US/docs/Glossary/Node.js) server that uses the [Express.js](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs) framework.

### Sign in/Sign up  
This feature connects to MongoDB atlas to access and append user account data, once the user signs in, a session id is stored that grants authentication for the user to access some pages. The [EnterPage](https://github.com/ZHJamesY/ChatRooms/blob/main/public/views/EnterPage.pug) pug file was rendered with different values to perform these tasks.
* [MongoDB Atlas](https://www.mongodb.com/atlas/database)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [express-session](https://www.npmjs.com/package/express-session)
* [uuid](https://www.npmjs.com/package/uuid)
* [Pug](https://pugjs.org/api/getting-started.html)

#### Incorrect username/password handling:  
![image1](https://user-images.githubusercontent.com/82336264/235332079-6c15a1d2-4742-4437-abd2-84c8ca236168.gif)

#### User session expired handling:
![image2](https://user-images.githubusercontent.com/82336264/235332115-389e1d79-86a3-48c6-b1fe-137653c55607.gif)

#### Sign up: user exists handling:
![image3](https://user-images.githubusercontent.com/82336264/235332126-5d648179-4fb2-4111-99c1-5b0e8df40cb9.gif)

### ChatRooms:
This feature allows users to create/join chat rooms and perform real-time communication with other users. The [ChatRooms](https://github.com/ZHJamesY/ChatRooms/blob/main/public/views/ChatRooms.pug) pug file was rendered with different values to perform these tasks.
* [socket.io](https://www.npmjs.com/package/socket.io)
* [Pug](https://pugjs.org/api/getting-started.html)

#### Create chat room:





