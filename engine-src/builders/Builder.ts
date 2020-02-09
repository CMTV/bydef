import p from 'path';
import { UtilIO } from '../Util';

const pug = require('pug');
const config = require('../../config');

export abstract class Builder<TView>
{
    private path: string;
    private outPath: string;
    protected view: TView;

    constructor(path: string, outPath: string, view: TView)
    {
        this.path =     p.normalize(path);
        this.outPath =  p.normalize(outPath);
        this.view =     view;
    }

    build()
    {
        let rendered = pug.renderFile(this.path, Object.assign({
            pretty: config.devMode,
            basedir: 'site'
        }, this.view));

        if (config.devMode)
        {
            UtilIO.writeFile(this.outPath + '.json', JSON.stringify(this.view, null, 4));
        }

        UtilIO.writeFile(this.outPath, rendered);
    }
}