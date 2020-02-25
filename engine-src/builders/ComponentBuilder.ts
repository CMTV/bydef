import p from 'path';

const pug = require('pug');
const config = require('../../config');

export class ComponentBuilder
{
    static render(data: any, component: string): string
    {
        return pug.renderFile(p.normalize('site/_layout/components/' + component), Object.assign({
            pretty: config.devMode,
            basedir: 'site'
        }, data));
    }
}