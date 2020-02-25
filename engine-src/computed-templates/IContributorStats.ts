import { UtilIO } from "../Util";

export interface IContributorStats
{
    place: number;
    adds: number;
    edits: number;
}

export function getContributorStats(id: string): IContributorStats
{
    return (<any> JSON.parse(UtilIO.readFile('computed/contributorStats.json'))[id]);
}