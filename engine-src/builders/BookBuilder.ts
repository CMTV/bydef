import { ConfigBuilder } from "./ConfigBuilder";
import { IBookView } from "../view-templates/pages/IBookView";

export class BookBuilder extends ConfigBuilder<IBookView>
{
    constructor(view: IBookView)
    {
        super(
            'site/_layout/book.pug',
            `out/${view.id}/index.html`,
            view
        );
    }   
}