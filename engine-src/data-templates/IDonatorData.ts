import { IDonatorView } from "../view-templates/pages/IDontatorsView";
import { UtilIO } from "../Util";

interface IDonatorsData
{
    tier3: IDonatorData[],
    tier2: IDonatorData[],
    tier1: IDonatorData[]
}

export interface IDonatorData
{
    id: string;
    name: string;
    
    link?: string;
    slogan?: string;
}

function dataToView(data: IDonatorData): IDonatorView
{
    return Object.assign(data, <IDonatorView> {
        hasAvatar: UtilIO.fileExists(`site/graphics/donators/${data.id}.png`)
    });
}

export function getDonatorsArrs()
{
    let out:any = {
        t1: [],
        t2: [],
        t3: []
    };

    let donatorsData: IDonatorsData = JSON.parse(UtilIO.readFile('data/donators.json'));

    donatorsData.tier1.forEach((donator) =>
    {
        out.t1.push(dataToView(donator));
    });

    donatorsData.tier2.forEach((donator) =>
    {
        out.t2.push(dataToView(donator));
    });

    donatorsData.tier3.forEach((donator) =>
    {
        out.t3.push(dataToView(donator));
    });

    ['t1', 't2', 't3'].forEach((tier) =>
    {
        if (!out[tier].length) delete out[tier];
    });

    return out;
}