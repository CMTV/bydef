const fs =      require('fs');
const p =       require('path');
const glob =    require('glob');

const util =    require('./util');

/**
 * Partials cache
 */
let partialsCache =  false;

function partials()
{
    if (partialsCache !== false)
    {
        return partialsCache;
    }

    let files = glob.sync
}