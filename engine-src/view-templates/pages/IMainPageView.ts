import { IHeadView } from "../IHeadView";
import { IBookStats } from "../../computed-templates/IBookStats";

export interface IBookItemView
{
    isCategory: boolean;
    id: string;
    icon: string;
    title: string;
    description: string;
    stats: IBookStats;
}

export interface IBooksCategoryView
{
    isCategory: boolean;
    title: string;
    description?: string;
}

export interface IMainPageView
{
    head: IHeadView;
    toc: (IBookItemView|IBooksCategoryView)[]
}