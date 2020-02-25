import { Iterator, ArticleStepData, StepMeta } from "../Iterator";
import { UtilIO, Util } from "../../Util";

export class ContributorStatsIterator extends Iterator
{
    contributorStats: any = {};

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        this.addIncreaseContributor(stepData.article.config.author, true);
        
        if (stepData.article.config.edits)
            stepData.article.config.edits.forEach((editor) => this.addIncreaseContributor(editor));
    }

    finally()
    {
        let ids = Object.keys(this.contributorStats);

        ids.sort((a, b) => {
            let aRating = Util.getContributorRating(this.contributorStats[a].adds, this.contributorStats[a].edits);
            let bRating = Util.getContributorRating(this.contributorStats[b].adds, this.contributorStats[b].edits);

            if (aRating > bRating) return -1;
            if (bRating > aRating) return 1;

            return 0;
        });

        for (let i = 0; i < ids.length; i++)
        {
            this.contributorStats[ids[i]].place = i + 1;
        }

        this.saveStats();
    }

    //
    //
    //

    addIncreaseContributor(id: string, isAdd = false)
    {
        if (!(id in this.contributorStats))
        {
            this.contributorStats[id] = { adds: 0, edits: 0 }
        }

        if (isAdd)
            this.contributorStats[id].adds++;
        else
            this.contributorStats[id].edits++;
    }

    saveStats()
    {
        UtilIO.writeFile('computed/contributorStats.json', JSON.stringify(this.contributorStats));        
    }
}