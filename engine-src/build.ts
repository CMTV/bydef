import { DonatorsBuilder } from "./builders/DonatorsBuilder";
import { Walker } from "./walker";

export function buildAll()
{
    //
    // Donators
    //

    (new DonatorsBuilder).build();

    //
    // Books
    //

    (new Walker).walkAll();
}