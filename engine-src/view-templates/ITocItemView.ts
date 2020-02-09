import { IArticleHeaderView } from "./IArticleHeaderView";

export interface ITocItemView
{
    isCategory: boolean;
    title: string;

    id?: string;
    description?: string;
    articleIndex?: number;
    isOptional?: boolean;

    headers?: IArticleHeaderView[];
}