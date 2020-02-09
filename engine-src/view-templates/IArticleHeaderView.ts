import { Util } from "../Util";

export interface IArticleHeaderView
{
    level: number;
    id: string;
    title: string;
}

function getId(id: string, existing: string[]): string
{
    id = Util.sanitizeId(id);

    while (existing.includes(id))
    {
        id += '-';
    }
    
    return id;
}

export function getArtcileHeaders(headers: {level: number, title: string}[]): IArticleHeaderView[]
{
    let out:IArticleHeaderView[] = [];
    let existingIds:string[] = [];

    headers.forEach((header) =>
    {
        let id = getId(header.title, existingIds);
        existingIds.push(id);

        out.push({
            level: header.level,
            title: header.title,
            id: id
        });
    });

    return out;
}

export function getArticleHeaderView(level: number, title: string): IArticleHeaderView
{
    return {
        level: level,
        title: title,
        id: Util.sanitizeId(title)
    }
}