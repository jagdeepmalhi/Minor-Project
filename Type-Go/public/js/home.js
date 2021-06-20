document.getElementById('nickName').addEventListener('input', ()=>{
    console.log(document.getElementById('nickName').value);
    let name = document.getElementById('nickName').value;
    localStorage.setItem('nickName', JSON.stringify(name));
})

document.getElementById('roomName').addEventListener('input', ()=>{
    let room = document.getElementById('roomName').value;
    localStorage.setItem('roomName', JSON.stringify(room));
})

document.getElementById('nickNameOfJoinUser').addEventListener('input', ()=>{
    let nickNameOfJoinUser = document.getElementById('nickNameOfJoinUser').value;
    localStorage.setItem('nickNameOfJoinUser', JSON.stringify(nickNameOfJoinUser));
})

document.getElementById('roomNameOfJoinUser').addEventListener('input', ()=>{
    let roomNameOfJoinUser = document.getElementById('roomNameOfJoinUser').value;
    localStorage.setItem('roomNameOfJoinUser', JSON.stringify(roomNameOfJoinUser));
})

if(JSON.parse(localStorage.getItem('joinError')) != null){
    let message = document.getElementById('message');
    message.innerText = `Room ${JSON.parse(localStorage.getItem('joinError'))} not Exist!`;
    let JoinAlert = document.getElementById('JoinAlert');
    JoinAlert.classList.remove('d-none');
    localStorage.removeItem('joinError');
}

if(JSON.parse(localStorage.getItem('adminLeftGame')) != null){
    let adminLeftGame = document.getElementById('adminLeftGame');
    adminLeftGame.innerText = JSON.parse(localStorage.getItem('adminLeftGame'));

    let AdminAlert = document.getElementById('AdminAlert');
    AdminAlert.classList.remove('d-none');
    localStorage.removeItem('adminLeftGame');
}

if(JSON.parse(localStorage.getItem('roomCreatingError')) != null){
    let roomExitAlready = document.getElementById('roomExitAlready');
    roomExitAlready.innerText = JSON.parse(localStorage.getItem('roomCreatingError'));

    let roomCreateError = document.getElementById('roomCreateError');
    roomCreateError.classList.remove('d-none');
    localStorage.removeItem('roomCreatingError');
}

