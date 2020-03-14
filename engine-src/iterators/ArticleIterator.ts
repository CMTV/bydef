import { Iterator, ArticleStepData, StepMeta, BookStepData, TaskStepData, IteratorContext } from "./Iterator";
import { IArticleView } from "../view-templates/pages/IArticleView";
import { ArticleBuilder } from "../builders/ArticleBuilder";
import { IHeadView } from "../view-templates/IHeadView";
import { UtilIO, BookUtil } from "../Util";
import { ITocItemView } from "../view-templates/ITocItemView";
import { MdHelper } from "../MdHelper";
import { ComponentBuilder } from "../builders/ComponentBuilder";
import { IArticleHeaderView } from "../view-templates/IArticleHeaderView";

const md = require('markdown-it')({
    html: true
});

md.use(require('markdown-it-attrs'), {
    leftDelimiter: '{:'
});

const config = require('../../config');

export class ArticleIterator extends Iterator
{
    article: IArticleView = <IArticleView> {};

    constructor()
    {
        super();
        this.setupMdRenderer();
    }

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        //
        this.makeHead(stepData, stepMeta);

        this.article.current = stepMeta.index + 1
        this.article.total = stepMeta.total;

        this.article.id = stepData.article.id;
        this.article.content = this.renderMdContent(stepData.article.content, stepData, stepMeta);
        this.article.book = {
            id: stepData.book.id,
            title: stepData.book.config.title,
            icon: UtilIO.readFile(`books/${stepData.book.id}/icon.svg`),
        }

        this.article.toc = <ITocItemView[]> JSON.parse(UtilIO.readFile(`computed/bookToc/${this.article.book.id}.json`));

        let I;

        this.article.toc.forEach((tocItem, i) =>
        {
            if (tocItem.id !== this.article.id) return;

            I = i;
            tocItem = Object.assign(tocItem, { isCurrent: true });
            this.article.headers = tocItem.headers;
        });

        this.article.previous = this.getPrevious(this.article.toc, I);
        this.article.next =     this.getNext(this.article.toc, I);
    }

    taskStep(stepData: TaskStepData, stepMeta: StepMeta)
    {
        if (stepMeta.isFirst)
        {
            this.article.content += `
                <div id="tasks" class="anchor"></div>
                <h2>
                    <i class="fas fa-check-circle"></i>
                    <span>Задачи (${stepMeta.total})</span>
                    <a href="#tasks" title="Ссылка на этот раздел" class="anchor-link"><i class="fas fa-link"></i></a>
                </h2>
            `.trim();

            this.article.headers.push(<IArticleHeaderView> {
                level: 2,
                id: 'tasks',
                title: `Задачи (${stepMeta.total})`
            });
        }

        let componentData = <TaskCD>
        {
            index: stepMeta.index + 1,
            title: stepData.task.config.title,
            difficulty: this.getDifficulty(stepData.task.config.difficulty),
            src: stepData.task.config.src
        }

        let getTaskPart = (taskPart: string) => {
            let regex = new RegExp(`^# ${taskPart}([\\s\\S]*?)^#`, 'gm');
            let match = regex.exec(stepData.task.content);

            return match ? md.render(match[1].trim()) : null;
        }

        componentData.content = getTaskPart('Задача');
        componentData.answer = getTaskPart('Ответ');
        componentData.solution = getTaskPart('Решение');
        componentData.hint = getTaskPart('Указание');

        this.article.content += ComponentBuilder.render(componentData, 'task.pug');
    }

    contextFinally(context: IteratorContext)
    {
        if (context !== IteratorContext.Article) return;

        this.buildArticle();
    }

    //
    //
    //

    //getContributors()

    getDifficulty(difficultyName: string)
    {
        let difficulty: any = { name: difficultyName };

        switch (difficultyName)
        {
            case 'easy':
                difficulty.icon = 'far fa-grin';
                difficulty.label = 'Легко';
                break;
            case 'normal':
                difficulty.icon = 'far fa-meh';
                difficulty.label = 'Нормально';
                break;
            case 'hard':
                difficulty.icon = 'far fa-grimace';
                difficulty.label = 'Сложно';
                break;
        }

        return difficulty;
    }

    setupMdRenderer()
    {
        MdHelper.registerMdBlock(md, 'info', 'fas fa-info-circle', 'Это интересно...');
        MdHelper.registerMdBlock(md, 'warning', 'fas fa-exclamation-triangle', 'Это важно!');
        MdHelper.registerProofBlock(md);
    }

    renderMdContent(content: string, stepData: ArticleStepData, stepMeta: StepMeta): string
    {
        content = MdHelper.stripMeta(content);
        content = MdHelper.renderArticleH1(content, stepMeta.index + 1, stepData.article.config.optional);
        content = MdHelper.renderHeaders(content);
        content = MdHelper.renderIndexItems(content, stepMeta.index + 1);

        return md.render(content);
    }

    getNext(toc: ITocItemView[], I: number)
    {
        let next = null;

        for (let i = I + 1; i < toc.length; i++)
        {
            if (toc[i].isCategory) continue;

            next = {
                id: toc[i].id,
                title: toc[i].title
            }
        }

        return next;
    }

    getPrevious(toc: ITocItemView[], I: number)
    {
        let previous = null;

        for (let i = 0; i < I; i++)
        {
            if (toc[i].isCategory) continue;

            previous = {
                id: toc[i].id,
                title: toc[i].title
            }
        }

        return previous;
    }

    makeHead(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        let headView: IHeadView = {
            title: `§${stepMeta.index + 1}. ${stepData.article.config.title} | ${stepData.book.config.title} - ByDef`,
            description: stepData.article.config.description,
            canonicalUrl: config.url + stepData.book.id + '/' + stepData.article.id,
            keywords: stepData.article.config.keywords,
            ogType: 'article',
            ogImage: BookUtil.getOgImage(stepData.book.id)
        };

        this.article.head = headView;
    }

    copyArticleFiles()
    {
        const fsExtra = require('fs-extra');

        fsExtra.copySync(
            `books/${this.article.book.id}/articles/${this.article.id}`,
            `out/${this.article.book.id}/${this.article.id}`,
            {
                filter: (src: string, dest: string) => 
                {
                    if (src.endsWith("article.md") || src.includes("tasks"))
                    {
                        return false;
                    }

                    return true;
                }
            }
        );
    }

    //
    //
    //

    buildArticle()
    {
        (new ArticleBuilder(this.article)).build();
        this.copyArticleFiles();

        this.article = <IArticleView> {};
    }
}