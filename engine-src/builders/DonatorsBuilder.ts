import { ConfigBuilder } from "./ConfigBuilder";
import { IDonatorsView } from "../view-templates/pages/IDontatorsView";
import { getHeadView } from "../view-templates/IHeadView";
import { getDonatorsArrs } from "../data-templates/IDonatorData";

const config = require('../../config');

export class DonatorsBuilder extends ConfigBuilder<IDonatorsView>
{
    constructor()
    {
        let headView = getHeadView({
            title: 'Спонсоры - ByDef',
            description: 'Прекрасные люди, которые материально поддерживают проект!',
            canonicalUrl: config.url + 'sponsors/',
            keywords: ['bydef', 'спонсор', 'донат']
        });

        let view: IDonatorsView = {
            head: headView,
            donators: getDonatorsArrs()
        }

        super(
            'site/_layout/donators.pug',
            'out/sponsors/index.html',
            view
        );
    }
}