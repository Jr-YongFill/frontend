import axios from 'axios';

export async function fetchUserSingup( checkEmail, checkPassword, checkNickname) {
    const response = await axios.post(`http://localhost:8080/api/sign-up`, { email: checkEmail, password: checkPassword, nickname: checkNickname });
    const data = await response.data;

    return data;
}

export async function fetchUserList() {
    const response = await axios.post(`/api/members/{member_id}`);
    const data = await response.data;

    return data;
}
export async function fetchLogout() {
    const response = await axios.post(`/api/logout`);
    const data = await response.data;
    return data;
}