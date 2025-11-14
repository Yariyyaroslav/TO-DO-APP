window.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem("token")){
        window.location.href = "../registerPage/register.html";
    }
})
document.addEventListener('DOMContentLoaded', async() => {
    const data = await getUserInfo();
    document.getElementById('username').innerHTML = data.username;
    document.getElementById('email').innerHTML = data.email;
})
const errorEmail = document.getElementById('errorEmail')
const email = document.getElementById('email')
const username = document.getElementById('username');
const changeUserName = document.getElementById('changeUserName');
const changeEmail = document.getElementById('changeEmail');
const changeUserNameForm = document.getElementById('changeUsernameForm');
const changeEmailForm = document.getElementById('changeEmailForm');
const formChange = document.querySelector('.formChange');
const formChangeEmail = document.querySelector('.formChangeEmail');
const backdrop = document.querySelector('.backdrop');
const logOut = document.getElementById('logout');
const logOutWindow = document.querySelector('.logOutWindow')
const logOutBtn = document.getElementById('logOutBtn');
const deleteAcc = document.getElementById('deleteAccount');
const deleteBtn = document.getElementById('deleteBtn');
const deleteReallyBtn = document.getElementById('deleteReallyBtn');
const deleteWindow = document.querySelector('.deleteWindow')
const deleteReallyWindow = document.querySelector('.deleteReallyWindow')

deleteAcc.addEventListener('click', (e) => {
    deleteWindow.style.display = 'flex';
    backdrop.style.display = 'flex';
})

deleteBtn.addEventListener('click', (e) => {
    deleteReallyWindow.style.display = 'flex';
})

deleteReallyBtn.addEventListener('click', async (e) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/auth/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            }
        });
        if (res.status === 200) {
            console.log('ok')
            localStorage.removeItem('token');
            window.location.reload();
        }

    }catch(err) {
        console.log(err);
    }
})
logOut.addEventListener('click', e => {
logOutWindow.style.display = 'flex';
    backdrop.style.display = 'block';
})
logOutBtn.addEventListener('click', e => {
    localStorage.removeItem('token');
    logOutWindow.style.display = 'none';
    backdrop.style.display = 'none';
    window.location.href = '../registerPage/register.html';
})

changeUserName.addEventListener('click', (e) => {
    formChange.style.display = 'flex';
    backdrop.style.display = 'block';
})

changeEmail.addEventListener('click', (e) => {
    formChangeEmail.style.display = 'flex';
    backdrop.style.display = 'block';
})
changeEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(changeEmailForm);
    const emailData = data.get('email');
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(String(emailData).toLowerCase())) {
        errorEmail.style.display = 'block';
        errorEmail.innerHTML = 'Please enter valid email';
        return;
    }
    const token = localStorage.getItem('token');
    try{
        const res = await fetch('/api/auth/updateEmail', {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                email: emailData,
            })

        })
        if(res.status === 400){
            errorEmail.style.display = 'block';
            errorEmail.innerHTML = 'An account with this email is already exist';
        }
        if(!res.ok){
            console.log('Error occured');
            return;
        }
        email.innerHTML = await res.json();
        formChangeEmail.style.display = 'none';
        backdrop.style.display = 'none';
    }catch(err){
        console.log(err)
    }
})
changeUserNameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(changeUserNameForm);
    const userName = data.get('username');
    const token = localStorage.getItem("token");
    try{
        const res = await fetch('/api/auth/updateName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({userName: userName})
        })
        if(!res.ok){
            console.log('Error occured');
            return;
        }
        username.innerHTML = await res.json();
        getUserInfo();
    }catch(err){
        console.log(err);
    }
    formChange.style.display = 'none';
    backdrop.style.display = 'none';
})

document.addEventListener('click', (e) => {
    if (formChange.style.display === 'flex' && !formChange.contains(e.target) && e.target.id !== 'changeUserName') {
        formChange.style.display = 'none';
        backdrop.style.display = 'none';
    }
    if (formChangeEmail.style.display === 'flex' && !formChangeEmail.contains(e.target) && e.target.id !== 'changeEmail') {
        formChangeEmail.style.display = 'none';
        backdrop.style.display = 'none';
    }
    if(logOutWindow.style.display === 'flex' && !logOutWindow.contains(e.target) && e.target.id !== 'logout') {
        logOutWindow.style.display = 'none';
        backdrop.style.display = 'none';
    }
})
