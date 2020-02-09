import { IHeadView } from "../IHeadView";
import { IContributorView } from "../IContributorView";
import { IArticleHeaderView } from "../IArticleHeaderView";
import { ITocItemView } from "../ITocItemView";

export interface IArticleView
{
    head: IHeadView;

    book:
    {
        id: string;
        title: string;
        icon: string;
    }

    id: string;
    content: string;

    headers: IArticleHeaderView[];
    toc: ITocItemView[];

    contributors: IContributorView[];
}