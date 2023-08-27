import axios from 'axios';
import jwt_decode from 'jwt-decode';

const baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/* Make API Requests */


/* To get username from Token */
export async function getUsername() {
    const token = localStorage.getItem('token')
    if (!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

/* authenticate function */
export async function authenticate(username) {
    try {
        let data = await axios.post(`${baseURL}/api/authenticate`, { username })
        return data;
    } catch (error) {
        return { error: "Username Doesn't Exists...!" }
    }
}

/* get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`${baseURL}/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password Doesn't Match...!" }
    }
}

/* register user function */
export async function registerUser(credentials) {
    try {
        const { data: { message }, status } = await axios.post(`${baseURL}/api/register`, credentials);

        let { username, email } = credentials;

        /* send email */
        if (status === 201) {
            await axios.post(`${baseURL}/api/registerMail`, { username, userEmail: email, text: message })
        }

        return Promise.resolve(message)
    } catch (error) {
        console.log('ERROR::', error);
        return Promise.reject({ error })
    }
}

/* login function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post(`${baseURL}/api/login`, { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't Match...!" })
    }
}

/* update user profile function */
export async function updateUser(response) {
    try {

        const token = localStorage.getItem('token');
        const data = await axios.put(`${baseURL}/api/updateuser`, response, { headers: { "Authorization": `Bearer ${token}` } });

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}

/* generate OTP */
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get(`${baseURL}/api/generateOTP`, { params: { username } });

        // send mail with the OTP
        if (status === 201) {
            let { data: { user: { email } } } = await getUser({ username });
            // let data = await getUser({ username });
            console.log('GENERATE OTP USERNAME::', email);
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post(`${baseURL}/api/registerMail`, { username, userEmail: email, text, subject: "Password Recovery OTP" })
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/* verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get(`${baseURL}/api/verifyOTP`, { params: { username, code } })
        return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/* reset password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put(`${baseURL}/api/resetPassword`, { username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}