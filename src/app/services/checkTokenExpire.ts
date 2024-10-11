import {NavigateFunction} from "react-router-dom";

export function checkTokenExpiry(navigate:NavigateFunction){
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;

        const currentTime = Date.now();

        if (currentTime > expiryTime) {
            localStorage.removeItem('token');
            console.log('Токен закінчився і був видалений з localStorage.');
            navigate('/admin/login')
        } else {
            console.log('Токен дійсний.');
        }
    } else {
        console.log('Токен не знайдено.');
        navigate('/admin/login')
    }
}
