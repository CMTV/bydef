import { Iterator, ArticleStepData, StepMeta } from "../Iterator";
import { ContributionType, IContribution } from "../../computed-templates/IContribution";
import { UtilIO } from "../../Util";

export class ContributorIterator extends Iterator
{
    contributions: any = {};

    articleStep(stepData: ArticleStepData, stepMeta: StepMeta)
    {
        this.addContribution(stepData.article.config.author, <IContribution> {
            type: ContributionType.Add,
            book: { id: stepData.book.id, title: stepData.book.config.title },
            article: { id: stepData.article.id, paragraph: stepMeta.index + 1, title: stepData.article.config.title }
        });

        if (stepData.article.config.edits)
        {
            stepData.article.config.edits.forEach((editor) => this.addContribution(editor, <IContribution> {
                type: ContributionType.Edit,
                book: { id: stepData.book.id, title: stepData.book.config.title },
                article: { id: stepData.article.id, paragraph: stepMeta.index + 1, title: stepData.article.config.title }
            }));
        }
    }

    finally()
    {
        this.saveContributors();
    }

    //
    //
    //

    addContribution(contributorId: string, contribution: IContribution)
    {
        if (!(contributorId in this.contributions))
        {
            this.contributions[contributorId] = [];
        }

        this.contributions[contributorId].push(contribution);
    }

    saveContributors()
    {
        Object.keys(this.contributions).forEach((contributor: string) => 
        {
            UtilIO.writeFile(`computed/contributions/${contributor}.json`, JSON.stringify(this.contributions[contributor]));
        });
    }
}