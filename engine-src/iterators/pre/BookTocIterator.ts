import { Iterator, BookStepData, StepMeta, ArticleStepData } from "../Iterator";
import { ITocItemView } from "../../view-templates/ITocItemView";
import { UtilIO } from "../../Util";
import { getArtcileHeaders } from "../../view-templates/IArticleHeaderView";
import { MdHelper } from "../../MdHelper";

export class BookTocIterator extends Iterator
{
    bookId: string;
    toc: ITocItemView[];

    bookStep(stepData: BookStepData, stepMeta: StepMeta)
    {
        if (!stepMeta.isFirst)
        {
            this.saveToc();
        }

        this.bookId = stepData.book.id;
        this.toc = [];
    }

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        this.toc.push({
            isCategory:     false,
            id:             stepData.article.id,
            title:          stepData.article.config.title,
            description:    stepData.article.config.description,
            articleIndex:   stepMeta.index + 1,
            isOptional:     stepData.article.config.optional,
            
            headers:        getArtcileHeaders(MdHelper.getHeaders(stepData.article.content, [1]))
        });
    }

    bookTocStep(tocItem: string|[string], stepData: BookStepData, stepMeta: StepMeta)
    {
        if (typeof tocItem === 'string') return;

        this.toc.push({
            isCategory: true,
            title: tocItem[0]
        });
    }

    finally()
    {
        this.saveToc();
    }

    ///
    ///
    ///

    saveToc()
    {
        UtilIO.writeFile(`computed/bookToc/${this.bookId}.json`, JSON.stringify(this.toc, null, 4));
    }
}