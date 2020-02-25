interface TaskCD
{
    index: number;
    title?: string;

    difficulty:
    {
        name: string;
        icon: string;
        label: string;
    }

    src?:
    {
        title: string;
        link: string;
    }

    content?: string;
    answer?: string;
    solution?: string;
    hint?: string;
}