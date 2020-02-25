import { IHeadView } from "../IHeadView";
import { IContributorView } from "../IContributorView";

export interface IContributorsView
{
    head: IHeadView;
    contributors: IContributorView[];
}