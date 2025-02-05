export interface IList {
    id?: number;
    name: string;
    description: string;
    userId?: string | null;
}

export interface IListItem {
    id?: number;
    listId?: number | null;
    name: string;
    description: string;
    category: string;
    cost: number;
    purchased: boolean;
}