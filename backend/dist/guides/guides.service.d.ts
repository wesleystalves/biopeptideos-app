export declare class GuidesService {
    findAll(isPremium?: boolean): {
        id: string;
        slug: string;
        title: string;
        description: string;
        category: string;
        isFree: boolean;
    }[];
    findBySlug(slug: string, isPremium?: boolean): {
        id: string;
        slug: string;
        title: string;
        description: string;
        category: string;
        isFree: boolean;
        content: string;
    } | {
        locked: boolean;
        id: string;
        slug: string;
        title: string;
        description: string;
        category: string;
        isFree: boolean;
    };
}
