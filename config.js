let devMode = true;
let url = 'https://bydef.ru';

module.exports = {
    devMode: devMode,
    url: (global.out) ? url : 'http://localhost:8080/',
    links:
    {
        donate: 'https://boosty.to/bydef',
        community: '',
        github: ''
    }
}