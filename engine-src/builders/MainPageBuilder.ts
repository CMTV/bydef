import { ConfigBuilder } from "./ConfigBuilder";
import { IMainPageView, IBooksCategoryView, IBookItemView } from "../view-templates/pages/IMainPageView";
import { getHeadView } from "../view-templates/IHeadView";
import { UtilIO } from "../Util";
import { getBookStats } from "../computed-templates/IBookStats";

const config = require('../../config');

export class MainPageBuilder extends ConfigBuilder<IMainPageView>
{
    constructor()
    {
        let headView = getHeadView({
            title: 'Учебники ByDef',
            description: 'Понятные, подробные и интересные учебники, которые дополняются и поддерживаются сообществом! Присоединяйтесь!',
            canonicalUrl: config.url,
            keywords: ['bydef', 'учебники bydef']
        });

        //
        //
        //

        let toc: any = [];
        let tocJson: (string|[string, string])[] = JSON.parse(UtilIO.readFile('books/config.json'));

        tocJson.forEach((tocItem) =>
        {
            if (typeof tocItem === 'string')
            {
                let bookConfig = <BookConfig> JSON.parse(UtilIO.readFile(`books/${tocItem}/config.json`));

                let bookItem: IBookItemView = 
                {
                    isCategory: false,
                    id: tocItem,
                    icon: UtilIO.readFile(`books/${tocItem}/icon.svg`),
                    title: bookConfig.title,
                    description: bookConfig.description,
                    stats: getBookStats(tocItem)
                };

                toc.push(bookItem);
            }
            else
            {
                let booksCategory: IBooksCategoryView = { isCategory: true, title: tocItem[0] };

                if (tocItem.length > 1)
                {
                    booksCategory.description = tocItem[1];
                }

                toc.push(booksCategory);
            }
        });

        //
        //
        //

        let view: IMainPageView = 
        {
            head: headView,
            toc: toc
        };

        super(
            'site/_layout/index.pug',
            'out/index.html',
            view
        );
    }
}