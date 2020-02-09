import { Iterator, ArticleStepData, StepMeta, BookStepData } from "./Iterator";
import { IArticleView } from "../view-templates/pages/IArticleView";
import { ArticleBuilder } from "../builders/ArticleBuilder";
import { IHeadView } from "../view-templates/IHeadView";
import { UtilIO } from "../Util";

const config = require('../../config');

export class ArticleIterator extends Iterator
{
    article: IArticleView = <IArticleView> {};

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        if (!stepMeta.isFirst) this.buildArticle();

        //
        this.makeHead(stepData, stepMeta);

        this.article.id = stepData.article.id;
        this.article.content = stepData.article.content;
        this.article.book = {
            id: stepData.book.id,
            title: stepData.book.config.title,
            icon: UtilIO.readFile(`books/${stepData.book.id}/icon.svg`),
        }
        //
    }

    bookTocStep(tocItem: string|[string], stepData: BookStepData, stepMeta: StepMeta)
    {

    }

    finally()
    {
        this.buildArticle();
    }

    //
    //
    //

    makeHead(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        let headView: IHeadView = {
            title: `${stepData.article.config.title} | ${stepData.book.config.title} - ByDef`,
            description: stepData.article.config.description,
            canonicalUrl: config.url + stepData.book.id + '/' + stepData.article.id,
            keywords: stepData.article.config.keywords,
            ogType: 'article'
        };

        this.article.head = headView;
    }

    //
    //
    //

    buildArticle()
    {
        (new ArticleBuilder(this.article)).build();
        this.article = <IArticleView> {};
    }
}