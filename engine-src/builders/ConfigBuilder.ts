import { Builder } from "./Builder";

const config = require('../../config');

export class ConfigBuilder<TView> extends Builder<TView>
{
    constructor(path: string, outPath: string, view: TView)
    {
        super(path, outPath, Object.assign({ _: config }, view));
    } 
}