interface BookConfig
{
    title: string;
    description: string;
    keywords?: string[];

    toc:
    [
        string|[string]
    ]
}