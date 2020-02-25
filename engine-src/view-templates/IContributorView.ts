import { IContributorData, getContributorData } from "../data-templates/IContributorData";
import { UtilIO, Util } from "../Util";
import { IContribution, getContributions } from "../computed-templates/IContribution";
import { getContributorStats } from "../computed-templates/IContributorStats";

export interface IContributorView extends IContributorData
{
    hasAvatar: boolean;

    place?: number;
    adds?: number;
    edits?: number;
}

export interface IFullContributorView extends IContributorView
{
    contributions: IContribution[]
}

export function getFullContributorView(contributor: string|IContributorData): IFullContributorView
{
    let view: IFullContributorView = <IFullContributorView> {};

    let contributorData = getContributorView(contributor);

    let stats = getContributorStats(contributorData.id);

    if (stats)
    {
        view.place = stats.place;
        view.adds = stats.adds;
        view.edits = stats.edits;
    }

    view.contributions = getContributions(contributorData.id);

    return Object.assign(contributorData, view);
}

export function getContributorView(contributor: string|IContributorData, adds: number = 0, edits: number = 0): IContributorView
{
    let contributorData;

    if (typeof contributor === 'string')
        contributorData = getContributorData(contributor);
    else
        contributorData = contributor;

    let view = Object.assign(contributorData, <IContributorView> {
        hasAvatar: UtilIO.fileExists(`site/graphics/contributors/${contributorData.id}.png`),
        adds: adds,
        edits: edits
    });

    return view;
}

export function sortContributors(contributors: IContributorView[])
{
    contributors.sort((a, b) => {
        let aRating = Util.getContributorRating(a.adds, a.edits);
        let bRating = Util.getContributorRating(b.adds, b.edits);

        if (aRating > bRating) return -1;
        if (bRating > aRating) return 1;

        return 0;
    });
}