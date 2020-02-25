import { ConfigBuilder } from "./ConfigBuilder";
import { IContributorsView } from "../view-templates/pages/IContributosView";
import { getHeadView } from "../view-templates/IHeadView";
import { IContributorData, getContributorsData } from "../data-templates/IContributorData";
import { IContributorView, getContributorView, sortContributors } from "../view-templates/IContributorView";
import { getContributorStats } from "../computed-templates/IContributorStats";

const config = require('../../config');

export class ContributorsBuilder extends ConfigBuilder<IContributorsView>
{
    constructor()
    {
        let headView = getHeadView({
            title: 'Вклад - ByDef',
            description: 'Прекрасные люди, которые пишут или редактируют параграфы учебников ByDef.',
            canonicalUrl: config.url + 'contributors',
            keywords: ['bydef', 'учебники bydef', 'вклад', 'авторы', 'редакторы', 'правки']
        });

        let contributorsViews: IContributorView[] = [];
        let contributors: IContributorData[] = getContributorsData();

        contributors.forEach((contributor) =>
        {
            let stats = getContributorStats(contributor.id);

            if (!stats) return;

            contributorsViews.push(getContributorView(contributor, stats.adds, stats.edits));
        });

        sortContributors(contributorsViews);

        let view: IContributorsView =
        {
            head: headView,
            contributors: contributorsViews
        };

        super(
            'site/_layout/contributors.pug',
            'out/contributors/index.html',
            view
        );
    }
}