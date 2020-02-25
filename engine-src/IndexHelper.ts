import * as xmlJs from 'xml-js';
import { MdHelper } from './MdHelper';
import { Util } from './Util';

export enum IndexType
{
    Definition = 'definition',
    Theorem = 'theorem',
    Axiom = 'axiom'
}

export enum TheoremType
{
    Theorem = 'theorem',
    Lemma = 'lemma',
    Corollary = 'corollary',
    Property = 'property'
    // TODO: Признак
    // TODO: Критерий
}

export interface IndexItemObj
{
    type: IndexType;
    counter: number;
    obj: any;
}

export interface IndexItem
{
    type: IndexType;
    id?: string;
    name?: string;
    content: string;
}

interface Definition extends IndexItem
{
    id: string;
    name: string;
    denote?: string;
}

interface Axiom extends IndexItem
{
    id: string;
    name: string;
    denote?: string;
}

interface Theorem extends IndexItem
{
    theoremType: TheoremType;
}

export class IndexHelper
{
    static getIndexTypeName(type: IndexType): string
    {
        switch (type)
        {
            case IndexType.Definition:  return 'Определение';
            case IndexType.Theorem:     return 'Теорема';
            case IndexType.Axiom:       return 'Аксиома';
        }
    }

    static getTheoremTypeName(type: TheoremType): string
    {
        switch (type)
        {
            case TheoremType.Theorem:   return 'Теорема';
            case TheoremType.Lemma:     return 'Лемма';
            case TheoremType.Corollary: return 'Следствие';
            case TheoremType.Property:  return 'Свойство';
        }
    }

    static getIndexItemLabel(indexType: IndexType, theoremType?: TheoremType)
    {
        if (!theoremType)
        {
            return this.getIndexTypeName(indexType);
        }
        else
        {
            if (typeof theoremType === 'string')
            {
                theoremType = this.getTheoremType(theoremType);
            }

            return this.getTheoremTypeName(theoremType);
        }
    }

    static getIndexType(strType: string): IndexType
    {
        let type: IndexType = IndexType[Util.up1Letter(strType) as keyof typeof IndexType];
        if (typeof type === 'undefined') throw new Error(`'${strType}' is not a valid index type!`);

        return type;
    }

    static getTheoremType(strType: string): TheoremType
    {
        let type: TheoremType = TheoremType[Util.up1Letter(strType) as keyof typeof TheoremType];
        if (typeof type === 'undefined') throw new Error(`'${strType}' is not a valid theorem type!`);

        return type;
    }

    /*static parseTheorem(xml: string): Theorem
    {
        let obj:any = xmlJs.xml2js(xml, { compact: true });
        if (!('theorem' in obj)) { throw new Error("The provided XML does not contain 'theorem' property!"); }
        obj = obj.theorem;

        //
        // Type
        //

        if (
            !('_attributes' in obj)
            ||
            !('type' in obj._attributes)
        )
        {
            throw new Error("The 'type' attribute must be specified for every theorem!");
        }

        let typeStr = (<string>obj._attributes.type).charAt(0).toUpperCase() + (<string>obj._attributes.type).slice(1);
        let type: TheoremType = TheoremType[typeStr as keyof typeof TheoremType];

        if (typeof type === 'undefined') { throw new Error(`'${typeStr}' is not a valid theorem type!`); }

        //
        // Description
        //

        if (!('_text' in obj)) { throw new Error("Every theorem must contain text inside!"); }

        let description:string = obj._text;

        //
        // Snippet
        //

        if ('snippet' in obj)
        {
            let snippet = obj.snippet;

            if ('description' in snippet) { description = snippet.description._text; }
        }

        //
        //
        //

        let theorem: Theorem = {
            theoremType: type,
            content: description
        };

        //
        // Id and Name
        //

        if ('id' in obj._attributes)
            theorem.id = obj._attributes.id;

        if ('name' in obj._attributes)
            theorem.name = obj._attributes.name;

        return theorem;
    }*/
}