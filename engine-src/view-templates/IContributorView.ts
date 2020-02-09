import { IContributorData, getContributorData } from "../data-templates/IContributorData";
import { UtilIO } from "../Util";

export interface IContributorView extends IContributorData
{
    hasAvatar: boolean;

    adds?: number;
    edits?: number;
}

export function getContributorView(id: string, adds: number = 0, edits: number = 0): IContributorView
{
    let contributorData = getContributorData(id);

    let view = Object.assign(contributorData, <IContributorView> {
        hasAvatar: UtilIO.fileExists(`site/graphics/contributors/${contributorData.id}.png`),
        adds: adds,
        edits: edits
    });

    return view;
}