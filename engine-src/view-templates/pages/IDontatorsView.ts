import { IHeadView } from "../IHeadView";
import { IDonatorData } from "../../data-templates/IDonatorData";

export interface IDonatorView extends IDonatorData
{
    hasAvatar: boolean;
}

export interface IDonatorsView
{
    head: IHeadView;
    donators:
    {
        t1?: IDonatorView[];
        t2?: IDonatorView[];
        t3?: IDonatorView[];
    }
}