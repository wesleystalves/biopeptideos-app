import { GuidesService } from './guides.service';
export declare class GuidesController {
    private readonly service;
    constructor(service: GuidesService);
    findAll(req: any): {
        id: string;
        slug: string;
        title: string;
        description: string;
        category: string;
        isFree: boolean;
    }[];
    findOne(slug: string, req: any): {
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
