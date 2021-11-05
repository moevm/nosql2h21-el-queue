import store from './Store'

var originalFetch = fetch;
window.fetch = function () {
    return originalFetch.apply(this, arguments)
        .then(response => {
            if (response.status === 401)
                store.dispatch({ type: 'SIGN_OUT' });

            // if (response.ok === false)
            //     return Promise.reject(response.json());
            return response;
        })
        .catch(error => console.log(error))

};

var headersDefault = () => ({
    Authorization: "JWT " + localStorage.getItem("accesstoken"),
    'Content-Type': 'application/json;charset=utf-8'
})

export default headersDefault





/*
function myFetch(params){
    return new Promise(function(resolve, reject){
       const xhr = new XMLHttpRequest();
        xhr.open(params.method, params.url, true);
        xhr.send();
        xhr.addEventListener('readystatechange', function(e){
              if( xhr.readyState !== 4  ) return;
              if( xhr.status == 200 ){
                   resolve( xhr.responseText );
               } else{ reject( xhr.statusText ); }
        });
}
*/