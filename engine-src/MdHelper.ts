import { IndexType, IndexItemObj } from "./IndexHelper";
import * as xmlJs from 'xml-js';

export class MdHelper
{
    static getMeta(md: string): object
    {
        let match = /^---$([\s\S]+?)^---$/gm.exec(md)[1];
        return match ? JSON.parse(match) : {};
    }

    static getHeaders(md: string, excludeLevels: number[] = []): { level: number; title: string }[]
    {
        let regex = /^(?<level>#+) (?<title>.+)$/gm;

        let out:any = [];
        let match:any;

        while (match = regex.exec(md))
        {
            let level = match.groups.level.length;
            let title = match.groups.title;

            if (!excludeLevels.includes(level))
            {
                out.push({ level: match.groups.level.length, title: match.groups.title });
            }            
        }

        return out;
    }

    static getIndexItemObjs(
        md: string,
        indexTypes: IndexType[] = [ IndexType.Axiom, IndexType.Definition, IndexType.Theorem ]
    ): IndexItemObj[]
    {
        let out:IndexItemObj[] = [];
        let match:any;

        indexTypes.forEach((iType) => {
            let regex = new RegExp(`^<${iType}[\\s\\S]*?<\\/${iType}>`, 'gm');
            let counter = 0;

            while (match = regex.exec(md))
            {
                out.push({
                    type: iType,
                    counter: ++counter,
                    obj: (<any> xmlJs.xml2js(match[0], { compact: true }))[iType]
                });
            }
        });

        return out;
    }
}