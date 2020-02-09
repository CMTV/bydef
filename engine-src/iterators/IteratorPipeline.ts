import { Iterator, IteratorContext, StepMeta } from "./Iterator";
import { BookIterator } from "./BookIterator";
import { IndexIterator } from "./IndexIterator";
import { ArticleIterator } from "./ArticleIterator";

class IteratorPipeline
{
    protected iterators: Iterator[];

    constructor(...iterators: Iterator[])
    {
        this.iterators = iterators;
    }

    step(context: IteratorContext, stepData: any, stepMeta: StepMeta)
    {
        switch (context)
        {
            case IteratorContext.Book:
                this.iterators.forEach(iterator => iterator.bookStep(stepData, stepMeta));
                break;
            
            case IteratorContext.Article:
                this.iterators.forEach(iterator => iterator.articleStep(stepData, stepMeta));
                break;

            case IteratorContext.Task:
                this.iterators.forEach(iterator => iterator.taskStep(stepData, stepMeta));
                break;
        }
    }

    customStep(context: IteratorContext, data: any, stepData: any, stepMeta: StepMeta)
    {
        switch (context)
        {
            case IteratorContext.BookToc:
                this.iterators.forEach(iterator => iterator.bookTocStep(data, stepData, stepMeta));
                break;
        }
    }

    finally()
    {
        this.iterators.forEach(iterator => iterator.finally());
    }
}

export default new IteratorPipeline(
    new IndexIterator,
    new BookIterator,
    new ArticleIterator
);