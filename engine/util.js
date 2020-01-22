const fs =  require('fs');
const p =   require('path');

exports.readFile = function (path)
{
    return fs.readFileSync(path, { encoding: 'utf-8' });
}

exports.writeFile = function (path, data)
{
    fs.mkdirSync(p.dirname, { recursive: true });
    fs.writeFileSync(path, data);
}