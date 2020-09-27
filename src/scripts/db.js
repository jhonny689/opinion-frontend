function dbConnect(url, options){
    if(options){
        return fetch(url, options)
            .then(resp => resp.json());
    }else{
        return fetch(url)
            .then(resp => resp.json());
    }
}

function getURL(endpoint){
    let baseURL = 'http://localhost:3000/';
    if(endpoint){
        baseURL += endpoint;
    }

    return baseURL;
}

function buildOptions(method, obj){
    const headers={
        'content-type': 'application/json',
        'accept': 'application/json'
    };
    
    return {
        method: method,
        headers: headers,
        body: JSON.stringify(obj)
    };
}