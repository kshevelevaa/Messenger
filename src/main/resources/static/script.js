const userList = document.querySelector('.list-unstyled')
const chatRoom = document.querySelector('#chatRoom')
const sendButton=document.querySelector('#sendButton')
var userTo
var username


const connect = () => {
    username = user["username"];
    if (username) {
        const socket = new SockJS('/chat')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
}

const onConnected = () => {
    if (user["id"] < userTo["id"])
        stompClient.subscribe('/topic/' + user["id"] + "/" + userTo["id"], onMessageReceived,
            {id: '/topic/' + user["id"] + "/" + userTo["id"]})

    else
        stompClient.subscribe('/topic/' + userTo["id"] + "/" + user["id"], onMessageReceived,
            {id: '/topic/' + userTo["id"] + "/" + user["id"]})
}

const onError = (error) => {
    console.log(error)
}

const sendMessage = () => {
    const messageInput = document.querySelector('#exampleFormControlInput2')
    const messageContent = messageInput.value.trim();

    const chatMessage = {
        content:messageContent,
        userFrom:user,
        userTo:userTo,
        sendTime:new Date(),

    }
    if (messageContent && stompClient)
        if (user["id"] < userTo["id"])
            stompClient.send("/chat.send/" + user["id"] + "/" + userTo["id"], {}, JSON.stringify(chatMessage))
        else
            stompClient.send("/chat.send/" + userTo["id"] + "/" + user["id"], {}, JSON.stringify(chatMessage))
}


const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body)
    createMessage(message)
}

loadUsers()

function loadUsers() {
    var settings = {
        "url": "http://localhost:8080/users",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        createAllUsers(response._embedded.users)
    });
}


function createAllUsers(response) {
    for (let i = 0; i < response.length; i++) {
        if (user.username !== response[i].username) {
            createUser(response[i])
        }
    }
}


function createUser(response) {
    const user = document.createElement('li')
    user.classList.add("p-2", "border-bottom")
    user.innerHTML = "<a href=\"#!\" class=\"d-flex justify-content-between\">\n" +
        "        <div class=\"d-flex flex-row\">\n" +
        "            <div>\n" +
        "                <img\n" +
        "                    src=\"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp\"\n" +
        "                    alt=\"avatar\" class=\"d-flex align-self-center me-3\" width=\"60\">\n" +
        "                    <span class=\"badge bg-success badge-dot\"></span>\n" +
        "            </div>\n" +
        "            <div class=\"pt-1\">\n" +
        "                <p class=\"fw-bold mb-0\">" + response.name + " " + response.surname + "</p>\n" +
        "                <p class=\"small text-muted\">Move to this chat</p>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"pt-1\">\n" +
        "            <p class=\"small text-muted mb-1\">Just now</p>\n" +
        "        </div>\n" +
        "    </a>"
    user.addEventListener('click', function () {
        showChat(response)
        user.removeEventListener('click', function () {
            showChat(response)})
    })
    userList.appendChild(user)
}

function showChat(receiver) {
    var settings = {
        "url": "http://localhost:8080/messages/search/findChat?userFrom=" + user.id + "&userTo=" + receiver.id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };


    $.ajax(settings).done(function (response) {
        connect()
        userTo=receiver
        chatRoom.innerHTML=''
        showAllMessages(response._embedded.messages)
        // console.log(response);
        // createAllUsers(response)
    });
}

function showAllMessages(response) {
    for (let i = 0; i < response.length; i++) {
        createMessage(response[i])
    }
}


function createMessage(response) {
    console.log(response)
    const message = document.createElement('div')
    if (response.userFrom.username !== user.username)
    {
        message.classList.add("d-flex", "flex-row", "justify-content-start")
        message.innerHTML="    <img src=\"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp\"\n" +
            "         alt=\"avatar 1\" style=\"width: 45px; height: 100%;\">\n" +
            "        <div>\n" +
            "            <p class=\"small p-2 ms-3 mb-1 rounded-3\" style=\"background-color: #f5f6f7;\">"+response.content+" </p>\n" +
            "            <p class=\"small ms-3 mb-3 rounded-3 text-muted float-end\">"+response.sendTime+"</p>\n" +
            "        </div>"
    }
    else
    {
        message.classList.add("d-flex", "flex-row", "justify-content-end")
        message.innerHTML="<div>\n" +
            "        <p class=\"small p-2 me-3 mb-1 text-white rounded-3 bg-primary\">"+response.content+"</p>\n" +
            "        <p class=\"small me-3 mb-3 rounded-3 text-muted\">"+response.sendTime+"</p>\n" +
            "    </div>\n" +
            "    <img src=\"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp\"\n" +
            "         alt=\"avatar 1\" style=\"width: 45px; height: 100%;\">"
    }
    chatRoom.appendChild(message)
    chatRoom.scrollTop = chatRoom.scrollHeight
}

sendButton.addEventListener('click',sendMessage)
document.querySelector('#exampleFormControlInput2').addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});




