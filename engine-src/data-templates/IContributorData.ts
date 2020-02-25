import { UtilIO } from "../Util";

export interface IContributorData
{
    id: string;
    name: string;

    link?: string;
    slogan?: string;
    forumUrl?: string;
}

export function getContributorData(id: string): IContributorData
{
    let json: IContributorData[] = getContributorsData();

    for (let i = 0; i < json.length; i++)
    {
        if (json[i].id === id)
        {
            return json[i];
        }
    }
}

export function getContributorsData(): IContributorData[]
{
    let contributors: IContributorData[] = JSON.parse(UtilIO.readFile('data/contributors.json'));
    return contributors;
}