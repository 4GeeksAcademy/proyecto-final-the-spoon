import { fetchWrapper, baseUrl, loginUrl, logoutUrl, registerUrl } from "./fetch";

const registerEndpoint = `${baseUrl}${registerUrl}` // /api/register
const loginEndpoint = `${baseUrl}${loginUrl}` // /api/login
const logoutEndpoint = `${baseUrl}${logoutUrl}` // /api/logout

export const postRegister = async (username, email, password) => {
    return await fetchWrapper(`${registerEndpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    }).then((data) => {
        return data;
    });
};

export const postLogin = async (email, password) => {
    return await fetchWrapper(`${loginEndpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    }).then((data) => {
        if (data.csrf_token) {
            sessionStorage.setItem("csrf_access_token", data.csrf_token);
        }

        // Si el backend devuelve el token explícitamente, lo guardamos
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        }
        return data;
    });
};

export const postLogout = async () => {
    return await fetchWrapper(`${logoutEndpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((data) => {
        sessionStorage.removeItem("csrf_access_token");
        localStorage.removeItem("token");
        return data;
    });
};