import chalk = require("chalk");

import { DonatorsBuilder } from "./builders/DonatorsBuilder";
import { Walker } from "./Walker";
import { PreIPipeline } from "./iterators/IteratorPipeline";
import { MainPageBuilder } from "./builders/MainPageBuilder";
import { ContributorsBuilder } from "./builders/ContributorsBuilder";
import { getContributorsData } from "./data-templates/IContributorData";
import { ContributorPageBuilder } from "./builders/ContributorPageBuilder";

export function buildAll()
{
    //
    // Donators
    //

    (new DonatorsBuilder).build();

    //
    // Computing Pre Data
    //
    
    console.log(chalk`{yellow.bold Computing Pre Data!}`);
    (new Walker(PreIPipeline())).walkAll();

    //
    // Books
    //

    console.log(chalk`{yellow.bold Building books!}`);
    (new Walker).walkAll();

    //
    // Main Page
    //
    
    console.log(chalk`{yellow.bold Building "Index" Page!}`);
    (new MainPageBuilder).build();

    //
    // Contributors
    //

    console.log(chalk`{yellow.bold Building "Contributors" Page}`);
    (new ContributorsBuilder).build();

    // Page for each contributors

    console.log(chalk`{yellow.bold Building page for each contributor!}`);

    let contributors_D = getContributorsData();

    contributors_D.forEach((contributor_D) =>
    {
        console.log(contributor_D.id + '...');
        (new ContributorPageBuilder(contributor_D)).build();
    });
}