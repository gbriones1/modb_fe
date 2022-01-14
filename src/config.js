
const API_PROTOCOL = process.env.API_PROTOCOL || (window._env_ || {}).API_PROTOCOL || "http"
const API_HOST = process.env.API_HOST || (window._env_ || {}).API_HOST || "127.0.0.1"
const API_PORT = process.env.API_PORT || (window._env_ || {}).API_PORT ||"8000"

const API_URL = API_PROTOCOL+"://"+API_HOST+":"+API_PORT
const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT || "/token"


let config = {
    apiURL: API_URL,
    loginEndpoint: API_URL+LOGIN_ENDPOINT
}

console.log(window._env_)
console.log("Using API endpoint", config.apiURL)

export default config;