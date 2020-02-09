import { Util } from "../Util";

export interface IHeadView
{
    title: string;
    description: string;
    canonicalUrl: string;
    
    keywords?: string[];
    ogType?: string;
    ogImage?: string;
}

export function getHeadView(data: IHeadView): IHeadView
{
    let _data: IHeadView = Object.create(data);

    _data.title =           Util.sanitizeMeta(_data.title);
    _data.description =     Util.sanitizeMeta(_data.description);
    _data.canonicalUrl =    Util.sanitizeMeta(_data.canonicalUrl);

    if ('keywords' in _data)
    {
        for (let i = 0; i < _data.keywords.length; i++)
        {
            _data.keywords[i] = Util.sanitizeMeta(_data.keywords[i]);
        }
    }

    if ('ogType' in _data)
    {
        _data.ogType =      Util.sanitizeMeta(_data.ogType);
    }

    if ('ogImage' in _data)
    {
        _data.ogImage =     Util.sanitizeMeta(_data.ogImage);
    }

    return _data;
}