const nameHeader = document.getElementById("nameHeader");
let user = localStorage.getItem("user");
const token = localStorage.getItem("token");
let userData;
async function getUserInfo(){
    if(!token){
        return;
    }
    try{
        const res = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'token': token,
            }
        })
        if(!res.ok){
            console.error("User not found");
            return;
        }
        userData = await res.json();
        if(userData){
            nameHeader.innerHTML = `Welcome ${userData.username}`;
        }else{
            nameHeader.innerHTML = `Welcome!`;
        }
        console.log(userData);

    }catch(err){
        console.log(err);
    }
}
getUserInfo();
