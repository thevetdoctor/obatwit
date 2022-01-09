export const baseUrl = (() => {
    if(window.location.host.indexOf('localhost') >= 0){
        console.log('localhost API');
    return 'http://localhost:4000';
    } else {
        console.log('live Url');
    return 'https://oba-twit.herokuapp.com';
    }
})();

export const frontendUrl = (() => {
    if(window.location.host.indexOf('localhost') >= 0){
        console.log('localhost frontendUrl');
    return 'http://localhost:3000/twits';
    } else {
        console.log('live frontendUrl');
    return 'https://peaceful-leakey-ce2e49.netlify.app/twits';
    }
})();