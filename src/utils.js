import config from './config';

async function loginUser(credentials) {
    // console.log(credentials)
    return fetch(
        config.loginEndpoint, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(credentials)
            body: new URLSearchParams(credentials)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                response.json().then((error) => {
                    // TODO: create session error
                })
                return null
            }
          })
        .then(data => data)
}

async function fetchData(name) {
    // console.log("fetching from "+name)
    let url = config.apiURL+"/"+name;
    let headers = {
        'Content-Type': 'application/json'
    }
    let token = localStorage.getItem("token")
    if (token){
        headers["Authorization"] = "Bearer "+token;
    }
    console.log("GET "+url)
    return fetch(
        url, {
            method: 'GET',
            headers: headers,
        })
}

export { loginUser, fetchData }