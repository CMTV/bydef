import { IHeadView } from "../IHeadView";
import { ITocItemView } from "../ITocItemView";
import { IContributorView } from "../IContributorView";
import { IBookIndexItemView } from "../IBookIndexItemView";

export interface IBookView
{
    head: IHeadView;

    id: string;
    title: string;
    description: string;

    firstArticleId: string;
    icon: string;

    tasksNum: number;

    toc: ITocItemView[];
    index: IBookIndexItemView[];
    contributors: IContributorView[];
}