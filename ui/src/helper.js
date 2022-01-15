export const baseUrl = (() => {
    if(window.location.host.indexOf('localhost') < 0){
    return 'http://localhost:4000';
    } else {
    return 'https://oba-twit.herokuapp.com';
    }
})();

export const frontendUrl = (() => {
    if(window.location.host.indexOf('localhost') >= 0){
    return 'http://localhost:3000/twits';
    } else {
    return 'https://peaceful-leakey-ce2e49.netlify.app/twits';
    }
})();