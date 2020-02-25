import { UtilIO } from "./Util";
import Listener from './WalkerListener';
import { BookStepData, IteratorContext, StepMeta, ArticleStepData, TaskStepData } from "./iterators/Iterator";
import { MdHelper } from "./MdHelper";
import { basename } from 'path';
import { existsSync, readdirSync, statSync } from "fs";
import { BuildIPipeline, IteratorPipeline } from "./iterators/IteratorPipeline";

export class Walker
{
    pipeline: IteratorPipeline;

    constructor(pipeline: IteratorPipeline = BuildIPipeline())
    {
        this.pipeline = pipeline;
    }

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
                total: bookIds.length,
                isFirst: bookIndex === 0,
                isLast: bookIndex + 1 === bookIds.length
            });
        });
    }

    protected walk(bookId: string, bookStepMeta: StepMeta = { index: 0, total: 1, isFirst: true, isLast: true })
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
        this.pipeline.step(IteratorContext.Book, bookStepData, bookStepMeta);

        // \\

        let articleIndex = 0;

        bookConfig.toc.forEach((tocItem, bookTocIndex) =>
        {
            //
            // BOOK TOC CUSTOM STEP
            //

            this.pipeline.customStep(IteratorContext.BookToc, tocItem, bookStepData, {
                index: bookTocIndex,
                total: bookConfig.toc.length,
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

            let articlesTotal = (bookConfig.toc.filter(item => typeof item === 'string')).length;
            Listener.articleStep(articleStepData);
            this.pipeline.step(IteratorContext.Article, articleStepData, {
                index: articleIndex,
                total: articlesTotal,
                isFirst: articleIndex === 0,
                isLast: articleIndex + 1 === articlesTotal
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
                    this.pipeline.step(IteratorContext.Task, taskStepData, {
                        index: taskIndex,
                        total: tasksFiles.length,
                        isFirst: taskIndex === 0,
                        isLast: taskIndex + 1 === tasksFiles.length
                    });

                    // \\
                });
            }
        });

        this.pipeline.finally();
    }
}