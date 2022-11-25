let chatRoomList = document.querySelector('.list-unstyled')
let modal = document.querySelector('.modal-content')
let createButton = modal.querySelector('.btn-primary')
createButton.addEventListener('click', createRoom)


function createRoom() {
    let input = modal.querySelector('.form-control').value
    if (input === "") {
        return
    }
    const chatRoom = {
        roomName: input,
        owner: user
    }

    var settings = {
        "url": "http://localhost:8080/chat/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(chatRoom),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

}