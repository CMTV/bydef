import { IHeadView } from "../IHeadView";
import { IContributorView } from "../IContributorView";
import { IArticleHeaderView } from "../IArticleHeaderView";
import { ITocItemView } from "../ITocItemView";
import { IContributorData } from "../../data-templates/IContributorData";

export interface IArticleView
{
    head: IHeadView;

    book:
    {
        id: string;
        title: string;
        icon: string;
    }

    current: number;
    total: number;

    id: string;
    content: string;

    headers: IArticleHeaderView[];
    toc: ITocItemView[];

    previous:   { title: string, id: string }
    next:       { title: string, id: string }

    contributors: IContributorData[];
}