import { BookStepData, ArticleStepData, TaskStepData } from "./iterators/Iterator";
import chalk from 'chalk';

const log = console.log;

class WalkerListener
{
    //
    // Main
    //

    bookStep(stepData: BookStepData)
    {
        log(chalk`{cyan Book} ${stepData.book.id}...`);
    }

    articleStep(stepData: ArticleStepData)
    {
        log(chalk`{cyan Article} ${stepData.article.id}...`);
    }

    taskStep(stepData: TaskStepData)
    {

    }

    //
    // Custom
    //
}

export default new WalkerListener();