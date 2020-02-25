import { IContributorData } from "../data-templates/IContributorData";
import { UtilIO } from "../Util";

export enum ContributionType
{
    Add = 'add',
    Edit = 'edit'
}

export interface IContribution
{
    type: ContributionType;
    book:
    {
        id: string;
        title: string;
    }
    article:
    {
        id: string;
        paragraph: number;
        title: string;
    }
}

export function getContributions(id: string): IContribution[]
{
    if (!UtilIO.fileExists(`computed/contributions/${id}.json`))
        return [];

    return JSON.parse(UtilIO.readFile(`computed/contributions/${id}.json`));
}