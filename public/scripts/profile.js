window.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem("token")){
        window.location.href = "../registerPage/register.html";
    }
})
document.addEventListener('DOMContentLoaded', async() => {
    const data = await getUserInfo();
    console.log(data);
    document.getElementById('username').innerHTML = data.username;
    document.getElementById('email').innerHTML = data.email;
})

const changeUserName = document.getElementById('changeUserName');
const changeEmail = document.getElementById('changeEmail');
const changeUserNameForm = document.getElementById('changeUsernameForm');
const formChange = document.querySelector('.formChange');
const backdrop = document.querySelector('.backdrop');


changeUserName.addEventListener('click', (e) => {
    formChange.style.display = 'flex';
    backdrop.style.display = 'block';
})

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('formChange') && !e.target.id === 'changeUserName') {
        formChange.style.display = 'none';
        backdrop.style.display = 'none';
    }
})