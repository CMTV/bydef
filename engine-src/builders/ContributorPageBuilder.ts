import { ConfigBuilder } from "./ConfigBuilder";
import { IContributorPageView } from "../view-templates/pages/IContributorPageView";
import { getHeadView } from "../view-templates/IHeadView";
import { getFullContributorView } from "../view-templates/IContributorView";
import { IContributorData } from "../data-templates/IContributorData";

const config = require('../../config');

export class ContributorPageBuilder extends ConfigBuilder<IContributorPageView>
{
    constructor(contributorData: IContributorData)
    {
        let contributor = getFullContributorView(contributorData);

        let headView = getHeadView({
            title: `${contributor.name} - ByDef`,
            description: `Вклад пользователя "${contributor.name}" в учебники ByDef.`,
            canonicalUrl: config.url + `contributors/${contributorData.id}`
        });

        let view: IContributorPageView = 
        {
            head: headView,
            contributor: contributor
        };

        super(
            'site/_layout/contributor.pug',
            `out/contributors/${contributorData.id}/index.html`,
            view
        );
    }
}