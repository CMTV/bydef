import { Iterator, BookStepData, StepMeta, ArticleStepData } from "./Iterator";
import { IBookView } from "../view-templates/pages/IBookView";
import { BookBuilder } from "../builders/BookBuilder";
import { IHeadView } from "../view-templates/IHeadView";
import { MdHelper } from "../MdHelper";
import { getArtcileHeaders } from "../view-templates/IArticleHeaderView";
import { UtilIO, Util } from "../Util";
import { getContributorView } from "../view-templates/IContributorView";
import { getIBookIndexItemViews } from "../view-templates/IBookIndexItemView";

const config = require('../../config');

export class BookIterator extends Iterator
{
    book: IBookView = <IBookView> {};

    //
    // Steps
    //

    bookStep(stepData: BookStepData, stepMeta: StepMeta)
    {
        if (!stepMeta.isFirst)
        {
            this.buildBook();
        }

        this.book.id = stepData.book.id;
        this.book.title = stepData.book.config.title;
        this.book.description = stepData.book.config.description;
        this.book.icon = UtilIO.readFile(`books/${stepData.book.id}/icon.svg`);

        this.makeHead(stepData);
        this.book.tasksNum = 0;

        this.book.toc = [];
        this.book.index = [];
        this.book.contributors = [];
    }

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        if (stepMeta.isFirst)
        {
            this.book.firstArticleId = stepData.article.id;
        }

        //
        // TOC
        //

        this.book.toc.push({
            isCategory:     false,
            id:             stepData.article.id,
            title:          stepData.article.config.title,
            description:    stepData.article.config.description,
            articleIndex:   stepMeta.index + 1,
            isOptional:     stepData.article.config.optional,
            
            headers:        getArtcileHeaders(MdHelper.getHeaders(stepData.article.content, [1]))
        });

        //
        // Contributors
        //

        this.handleContributors(stepData);

        //
        // Index items (definitions, theorems...)
        //

        this.book.index = this.book.index.concat(getIBookIndexItemViews(stepData, stepMeta.index + 1));
    }

    bookTocStep(tocItem: string|[string], stepData: BookStepData, stepMeta: StepMeta)
    {
        if (typeof tocItem === 'string') return;

        this.book.toc.push({
            isCategory: true,
            title: tocItem[0]
        })
    }

    taskStep()
    {
        this.book.tasksNum++;
    }

    finally()
    {
        this.buildBook();
    }

    //
    //
    //

    handleContributors(stepData: ArticleStepData)
    {
        this.pushUpdateContributor(stepData.article.config.author);

        if (!stepData.article.config.edits) { return; }

        for (let i = 0; i < stepData.article.config.edits.length; i++)
        {
            this.pushUpdateContributor(stepData.article.config.edits[i], false);
        }
    }

    pushUpdateContributor(id: string, isAuthor: boolean = true)
    {
        for (let i = 0; i < this.book.contributors.length; i++)
        {
            if (this.book.contributors[i].id === id)
            {
                if (isAuthor) { this.book.contributors[i].adds++; }
                else { this.book.contributors[i].edits++; }

                return;
            }
        }

        let toPush = getContributorView(id);

        if (isAuthor) { toPush.adds++; }
        else { toPush.edits++; }

        this.book.contributors.push(toPush);
    }

    sortContributors()
    {
        this.book.contributors.sort((a, b) => {
            let aRating = Util.getContributorRating(a.adds, a.edits);
            let bRating = Util.getContributorRating(b.adds, b.edits);

            if (aRating > bRating) return -1;
            if (bRating > aRating) return 1;

            return 0;
        });
    }

    sortIndex()
    {
        this.book.index.sort((a, b) => {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();

            return (textA < textB) ? -1 : (textA > textB ) ? 1 : 0;
        });
    }

    makeHead(stepData: BookStepData)
    {
        let headView: IHeadView = {
            title: `${stepData.book.config.title} - ByDef`,
            description: stepData.book.config.description,
            canonicalUrl: config.url + stepData.book.id,
            keywords: stepData.book.config.keywords,
            ogType: 'book',
            ogImage: config.url + stepData.book.id + '/og.png'
        };

        this.book.head = headView;
    }

    buildBook()
    {
        this.sortContributors();
        this.sortIndex();
        
        (new BookBuilder(this.book)).build();
        this.book = <IBookView> {};
    }
}