import { ConfigBuilder } from "./ConfigBuilder";
import { IArticleView } from "../view-templates/pages/IArticleView";

export class ArticleBuilder extends ConfigBuilder<IArticleView>
{
    constructor(view: IArticleView)
    {
        super(
            'site/_layout/article.pug',
            `out/${view.book.id}/${view.id}/index.html`,
            view
        );
    }
}