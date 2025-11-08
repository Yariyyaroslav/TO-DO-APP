if(localStorage.getItem('token')){
    window.location.href = '../mainPage/Main.html';
}
const regForm = document.getElementById("signUpForm");
if (regForm) {
    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById('Username').value;
        const email = document.getElementById('Useremail').value;
        const password = document.getElementById('password').value;
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!re.test(String(email).toLowerCase())) {
            console.error("Please enter valid email");
            return;
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password})
            });

            const data = await res.json();

            if (!res.ok) {
                document.querySelector('.errEx').style.display = 'block';
                return;
            }
            localStorage.setItem('token', data.token);
            regForm.reset();
            window.location.href = '/MainPage/Main.html';
        } catch (err) {
            console.error('Error:', err);
        }
    })
}
const errH = document.querySelector('.errPass')
const logForm = document.getElementById("loginInForm");
if (logForm) {
    logForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById('UseremailLoginIn').value;
        const password = document.getElementById('passwordLoginIn').value;
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!re.test(String(email).toLowerCase())) {
            errH.style.display = 'block';
            errH.innerHTML = 'Please enter valid email';
            return;
        }
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            const data = await res.json();

            if (!res.ok) {
                errH.style.display = 'block';
                errH.innerHTML = 'Wrong email or password';
                return;
            }
            localStorage.setItem('token', data.token);
            logForm.reset();
            window.location.href = '/MainPage/Main.html';

        } catch (err) {
            console.error('Error:', err);
        }
    })
}