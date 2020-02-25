export enum IteratorContext
{
    //
    // Main
    //

    Book,
    Article,
    Task,

    //
    // Custom
    //

    BookToc
}

export interface StepMeta
{
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
}

export interface BookStepData
{
    book:
    {
        id: string;
        config: BookConfig;
    }
}

export interface ArticleStepData extends BookStepData
{
    article:
    {
        id: string;
        config: ArticleConfig;
        content: string;
    }
}

export interface TaskStepData extends ArticleStepData
{
    task:
    {
        config: TaskConfig;
        content: string;
    }
}

export abstract class Iterator
{
    //
    // Main steps
    //

    bookStep    (stepData: BookStepData, stepMeta: StepMeta) {}
    articleStep (stepData: ArticleStepData, stepMeta: StepMeta) {}
    taskStep    (stepData: TaskStepData, stepMeta: StepMeta) {}

    //
    // Custom steps
    //

    bookTocStep (tocItem: string|[string], stepData: BookStepData, stepMeta: StepMeta) {}

    //

    finally() {}
}