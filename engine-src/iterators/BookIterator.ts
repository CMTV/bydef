import { Iterator, BookStepData, StepMeta, ArticleStepData, IteratorContext } from "./Iterator";
import { IBookView } from "../view-templates/pages/IBookView";
import { BookBuilder } from "../builders/BookBuilder";
import { IHeadView } from "../view-templates/IHeadView";
import { UtilIO, Util, BookUtil } from "../Util";
import { getContributorView, sortContributors } from "../view-templates/IContributorView";
import { getIBookIndexItemViews } from "../view-templates/IBookIndexItemView";
import { ITocItemView } from "../view-templates/ITocItemView";

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

        this.book.toc = <ITocItemView[]> JSON.parse(UtilIO.readFile(`computed/bookToc/${this.book.id}.json`));
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
        // Contributors
        //

        this.handleContributors(stepData);

        //
        // Index items (definitions, theorems...)
        //

        this.book.index = this.book.index.concat(getIBookIndexItemViews(stepData, stepMeta.index + 1));
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
            ogImage: BookUtil.getOgImage(stepData.book.id)
        };

        this.book.head = headView;
    }

    rest()
    {
        const fsExtra = require('fs-extra');

        // Moving Open Graph image if exists
        if (UtilIO.fileExists(`books/${this.book.id}/og.png`))
        {
            fsExtra.copySync(
                `books/${this.book.id}/og.png`,
                `out/${this.book.id}/og.png`
            );
        }
    }

    buildBook()
    {
        sortContributors(this.book.contributors);
        this.sortIndex();
        this.rest();
        
        (new BookBuilder(this.book)).build();
        this.book = <IBookView> {};
    }
}