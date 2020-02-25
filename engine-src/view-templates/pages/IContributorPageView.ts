import { IHeadView } from "../IHeadView";
import { IFullContributorView } from "../IContributorView";

export interface IContributorPageView
{
    head: IHeadView,
    contributor: IFullContributorView
}