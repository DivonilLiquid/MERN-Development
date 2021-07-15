/* eslint-disable */
const login = async (email,password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data:{
                email,
                password,
            }
        })
        console.log(res);
    } catch(e){
        console.log(e.response.data);
    }
    
};
// console.log('Hello from js file');
document.querySelector('.form').addEventListener('submit',el => {
    el.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});