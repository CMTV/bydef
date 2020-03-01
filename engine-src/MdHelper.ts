import { IndexType, IndexItemObj, IndexHelper, TheoremType } from "./IndexHelper";
import * as xmlJs from 'xml-js';
import { Util } from "./Util";
import { ComponentBuilder } from "./builders/ComponentBuilder";

export class MdHelper
{
    static metaRegExp = new RegExp(/^---$([\s\S]+?)^---$/gm, 'gm');

    static getMeta(md: string): object
    {
        let match = /^---$([\s\S]+?)^---$/gm.exec(md)[1];
        return match ? JSON.parse(match) : {};
    }

    static stripMeta(md: string): string
    {
        return md.replace(this.metaRegExp, '');
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

    //
    //
    //

    static registerMdBlock(md: any, blockName: string, icon: string, defaultTitle: string)
    {
        md.use(require('markdown-it-container'), blockName, {
            render(tokens: any, i: number)
            {
                let match = tokens[i].info.trim().match(new RegExp(`^${blockName}\\s+(.*)$`));
                
                if (tokens[i].nesting === 1) 
                {
                    let headerText = (match) ? (md.utils.escapeHtml(match[1])) : defaultTitle;

                    return `
                        <div class="block block--${blockName}">
                            <div class="block-header"><i class="${icon}"></i><span>${headerText}</span></div>
                            <div class="block-content">
                    `              
                } 
                else
                    return `</div></div>`
            }
        });
    }
    
    static registerProofBlock(md: any)
    {
        md.use(require('markdown-it-container'), 'proof', {
            render(tokens: any, i: number)
            {
                if (tokens[i].nesting === 1)
                {
                    return `
                        <proof inline-template>
                            <div class="proof" :class="{ _opened : opened }" title="Показать/скрыть доказательство">
                                <div @click="opened = !opened" class="proof-header"><span>Доказательство</span><i class="fas fa-angle-right"></i></div>
                                    <div v-show="opened" class="proof-content">
                    `
                }
                else
                    return '</div></div></proof>';
            }
        });
    }

    //
    //
    //

    static renderArticleH1(md: string, counter: number, isOptional: boolean = false): string
    {
        let regex = /^(#) (?<title>.+)$/gm;

        md = md.replace(regex, (match, level, title) =>
        {
            return ComponentBuilder.render(<ArticleH1CD> {
                counter: counter,
                id: Util.sanitizeId(title),
                title: title,
                optional: isOptional
            }, 'articleH1.pug');
        });

        return md;
    }

    static renderHeaders(md: string): string
    {
        let regex = /^(?<level>##+) (?<title>.+)$/gm;

        md = md.replace(regex, (match, level, title) =>
        {
            level = level.length;
            
            let id = Util.sanitizeId(title);

            return `
            <div id="${id}" class="anchor"></div>
            <h${level}>
                <span>${title}</span>
                <a href="#${id}" class="anchor-link" title="Ссылка на этот раздел">
                    <i class="fas fa-link"></i>
                </a>
            </h${level}>
            `.trim();
        });

        return md;
    }

    static renderIndexItems(md: string, articleIndex: number): string
    {
        let indexTypes = [IndexType.Axiom, IndexType.Definition, IndexType.Theorem];

        indexTypes.forEach((iType) => {
            let regex = new RegExp(`^<${iType}[\\s\\S]*?<\\/${iType}>`, 'gm');
            let counter = 0;

            let theoremCounters: any = {};

            Object.keys(TheoremType).forEach((typeName) =>
            {
                theoremCounters[typeName.toLocaleLowerCase()] = 0;
            });

            md = md.replace(regex, (match) =>
            {
                counter++;

                let matchObj = (<any> xmlJs.xml2js(match, { compact: true }))[iType];
                let content = require('markdown-it')().render(matchObj._text.trim());

                let indexLabel = IndexHelper.getIndexItemLabel(iType, matchObj._attributes.type);
                let id = matchObj._attributes.id || `${iType}-${counter}`;

                if (matchObj._attributes.type)
                {
                    theoremCounters[matchObj._attributes.type]++;   
                }

                let counterOut = (matchObj._attributes.type ? theoremCounters[matchObj._attributes.type] : counter)

                let info = `
                    <span>${indexLabel}</span>
                    <a title="Ссылка на этот элемент индекса" href="#${id}">${ articleIndex + '.' + counterOut }</a>
                `.trim();

                let hasTitle = !!(matchObj._attributes.name || matchObj._attributes.title);
                let title = matchObj._attributes.name || matchObj._attributes.title || info;
            
                return `
                    <div id="${id}" class="anchor"></div>
                    <div class="block block-index block--${iType} ${!hasTitle ? '_noTitle' : ''}">
                        <div class="block-info">
                            ${info}
                        </div>
                        <div class="block-title">${title}</div>
                        <div class="block-content">${content}</div>
                    </div>
                `.trim();
            });
        });

        return md;
    }
}