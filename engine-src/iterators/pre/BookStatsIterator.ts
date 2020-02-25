import { Iterator, BookStepData, StepMeta, ArticleStepData, TaskStepData } from "../Iterator";
import { IBookStats } from "../../computed-templates/IBookStats";
import { UtilIO } from "../../Util";
import { MdHelper } from "../../MdHelper";

export class BookStatsIterator extends Iterator
{
    bookId: string;
    stats: IBookStats;

    bookStep(stepData: BookStepData, stepMeta: StepMeta)
    {
        if (!stepMeta.isFirst) this.saveStats();

        this.bookId = stepData.book.id;

        this.stats = 
        {
            articlesNum: (stepData.book.config.toc.filter(tocItem => typeof tocItem === 'string')).length,
            indexItemsNum: 0,
            tasksNum: 0
        };
    }

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        this.stats.indexItemsNum += MdHelper.getIndexItemObjs(stepData.article.content).length;
    }

    taskStep(stepData: TaskStepData, stepMeta: StepMeta)
    {
        this.stats.tasksNum++;
    }

    finally()
    {
        this.saveStats();
    }

    //
    //
    //

    saveStats()
    {
        UtilIO.writeFile(`computed/bookStats/${this.bookId}.json`, JSON.stringify(this.stats, null, 4));
    }
}