export class Util
{
    static sanitizeId(content: string): string
    {
        let out = content;

        out = out.trim();
        out = out.replace(/(\r\n|\n|\r|\s+)/gm, '-');
        out = out.replace(/"/gm, '');
        out = out.toLocaleLowerCase();

        return out;
    }

    static sanitizeMeta(content: string): string
    {
        let out = content;

        out = out.replace(/(\r\n|\n|\r)/gm, '');
        out = out.substring(0, 400);
        out = out.trim();
        
        return out;
    }

    static getContributorRating(adds: number = 0, edits: number = 0)
    {
        return 10 * adds + edits;
    }

    static up1Letter(str: string): string
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export class BookUtil
{
    static getOgImage(bookId: string): string
    {
        const config = require('../config');

        if (UtilIO.fileExists(`books/${bookId}/og.png`))
        {
            return config.url + bookId + '/og.png';
        }
        else
        {
            return config.url + 'graphics/og-image.png';
        }
    }
}

import fs from 'fs';
import p from 'path';

export class UtilIO
{
    static fileExists(path: string): boolean
    {
        return fs.existsSync(p.normalize(path));
    }

    static writeFile(path: string, data: string): void
    {
        path = p.normalize(path);

        fs.mkdirSync(p.dirname(path), { recursive: true });
        fs.writeFileSync(path, data);
    }

    static readFile(path: string): string
    {
        path = p.normalize(path);

        return fs.readFileSync(path, { encoding: 'utf-8' });
    }
}