interface ArticleConfig
{
    title: string;
    description: string;
    keywords: string[];

    optional: boolean;

    // Author contributor ID
    author: string;

    // Editors contributor IDs
    edits?: string[];
}