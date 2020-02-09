import { UtilIO } from "./Util";
import IPipeline from './iterators/IteratorPipeline';
import Listener from './WalkerListener';
import { BookStepData, IteratorContext, StepMeta, ArticleStepData, TaskStepData } from "./iterators/Iterator";
import { MdHelper } from "./MdHelper";
import { basename } from 'path';
import { existsSync, readdirSync, statSync } from "fs";

export class Walker
{
    walkAll() 
    {
        let bookIds = readdirSync('books').filter((file) => {
            return statSync(`books/${file}`).isDirectory();
        });

        this.walkSome(bookIds);
    }

    walkSome(bookIds: string[]) 
    {
        bookIds.forEach((bookId, bookIndex) =>
        {
            this.walk(bookId, {
                index: bookIndex,
                isFirst: bookIndex === 0,
                isLast: bookIndex + 1 === bookIds.length
            });
        });
    }

    protected walk(bookId: string, bookStepMeta: StepMeta = { index: 0, isFirst: true, isLast: true })
    {
        let bookConfig: BookConfig = JSON.parse(UtilIO.readFile(`books/${bookId}/config.json`));

        //
        // BOOK STEP
        //

        let bookStepData = <BookStepData> {
            book:
            {
                id: bookId,
                config: bookConfig
            }
        }
        
        Listener.bookStep(bookStepData);
        IPipeline.step(IteratorContext.Book, bookStepData, bookStepMeta);

        // \\

        let articleIndex = 0;

        bookConfig.toc.forEach((tocItem, bookTocIndex) =>
        {
            //
            // BOOK TOC CUSTOM STEP
            //

            IPipeline.customStep(IteratorContext.BookToc, tocItem, bookStepData, {
                index: bookTocIndex,
                isFirst: bookTocIndex === 0,
                isLast: bookTocIndex + 1 === bookConfig.toc.length
            });

            // \\

            if (typeof tocItem !== 'string') return;

            let articleMd = UtilIO.readFile(`books/${bookId}/articles/${tocItem}/article.md`);

            //
            // ARTICLE STEP
            //

            let articleStepData = Object.assign(bookStepData, <ArticleStepData> {
                article:
                {
                    id: basename(tocItem, '.md'),
                    config: MdHelper.getMeta(articleMd),
                    content: articleMd
                }
            });

            Listener.articleStep(articleStepData);
            IPipeline.step(IteratorContext.Article, articleStepData, {
                index: articleIndex,
                isFirst: articleIndex === 0,
                isLast: articleIndex + 1 === (bookConfig.toc.filter(item => typeof item === 'string')).length
            });

            articleIndex++;

            // \\

            let tasksPath = `books/${bookId}/articles/${tocItem}/tasks`;

            if (existsSync(tasksPath))
            {
                let tasksFiles = readdirSync(tasksPath);

                tasksFiles.forEach((taskFile, taskIndex) => {
                    let taskMd = UtilIO.readFile(tasksPath + '/' + taskFile);

                    //
                    // TASK STEP
                    //

                    let taskStepData = Object.assign(articleStepData, <TaskStepData> {
                        task:
                        {
                            config: MdHelper.getMeta(taskMd),
                            content: taskMd
                        }
                    });

                    Listener.taskStep(taskStepData);
                    IPipeline.step(IteratorContext.Task, taskStepData, {
                        index: taskIndex,
                        isFirst: taskIndex === 0,
                        isLast: taskIndex + 1 === tasksFiles.length
                    });

                    // \\
                });
            }
        });

        IPipeline.finally();
    }
}