import { UtilIO } from "../Util";

export interface IBookStats
{
    articlesNum: number;
    indexItemsNum: number;
    tasksNum: number;
}

export function getBookStats(bookId: string): IBookStats
{
    return <IBookStats> JSON.parse(UtilIO.readFile(`computed/bookStats/${bookId}.json`));
}