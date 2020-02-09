import { Iterator, ArticleStepData, StepMeta } from "./Iterator";
import { MdHelper } from "../MdHelper";
import { IndexItemObj, IndexType, IndexHelper } from "../IndexHelper";
import { UtilIO } from "../Util";

interface IndexMetaItem
{
    type: IndexType;
    typeLabel: string;
    id: string;
    //name: string;
    description: string;

    synonyms?: string[];
    denote?: string;
    examples?: string;
}

export class IndexIterator extends Iterator
{
    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        let indexObjects = MdHelper.getIndexItemObjs(stepData.article.content)

        indexObjects.forEach((indexObj) => 
        {
            if (!indexObj.obj._attributes.id) return; // Not saving index items without 'id'

            let metaItem = this.getMetaItem(indexObj);
            this.saveMetaItem(metaItem, `out/${stepData.book.id}/index/${metaItem.id}.json`);
        });
    }

    //
    //
    //

    getMetaItem(iObj: IndexItemObj): IndexMetaItem
    {
        let metaItem: IndexMetaItem = <IndexMetaItem> {};

        metaItem.type = iObj.type;
        metaItem.typeLabel = IndexHelper.getIndexItemLabel(iObj.type, iObj.obj._attributes.type);
        metaItem.id = iObj.obj._attributes.id;
        metaItem.description = iObj.obj?.meta?.description?._text || iObj.obj._text;
        
        if (iObj.obj.meta)
        {
            //
            // Synonyms
            //

            let metaObj = iObj.obj.meta;

            if (metaObj.synonyms)
            {
                metaItem.synonyms = [];

                metaObj.synonyms.synonym.forEach((synonym: any) =>
                {
                    metaItem.synonyms.push(synonym._text);
                });
            }

            //
            // Other
            //

            metaItem.denote = metaObj.denote?._text;
            metaItem.examples = metaObj.examples?._text;
        }

        return metaItem;
    }

    saveMetaItem(item: IndexMetaItem, savePath: string)
    {
        UtilIO.writeFile(savePath, JSON.stringify(item));
    }
}