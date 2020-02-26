import { UtilIO } from "./Util";

const config = require('../config');

function build_CNAME()
{
    UtilIO.writeFile('out/CNAME', config.url.replace('https://', ''));
}

export function buildAll()
{
    // CNAME
    build_CNAME();
}