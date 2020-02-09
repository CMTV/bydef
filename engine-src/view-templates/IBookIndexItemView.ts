import { IndexType, IndexHelper } from "../IndexHelper";
import { MdHelper } from "../MdHelper";
import { ArticleStepData } from "../iterators/Iterator";

export interface IBookIndexItemView
{
    type: IndexType;
    id: string;
    name: string;

    label: string;
    numId: string;

    urlPath: string;
    metaPath: string;
}

export function getIBookIndexItemViews(data: ArticleStepData, articleIndex: number): IBookIndexItemView[]
{
    let out: IBookIndexItemView[] = [];

    let objects = MdHelper.getIndexItemObjs(data.article.content);

    objects.forEach((object) =>
    {
        if (!object.obj._attributes.id) return; // Skipping index items without id

        let label = IndexHelper.getIndexItemLabel(object.type, object.obj._attributes.type);
        let numId = `${articleIndex}.${object.counter}`;

        out.push({
            type: object.type,
            id: object.obj._attributes.id,
            name: object.obj._attributes.name || label + ' ' + numId,

            urlPath: `${data.book.id}/${data.article.id}#${object.obj._attributes.id}`,
            metaPath: `${data.book.id}/index/${object.obj._attributes.id}.json`,

            label: label,
            numId: numId
        });
    });

    return out;
}