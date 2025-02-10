export interface IList {
    id?: number;
    name: string;
    description: string;
    userId?: string | null;
    listItemCount?: number;
}

export interface IListItemResponse {
    listItems: IListItem[],
    totalCost: number
}

export interface IListItem {
    id?: number;
    listId?: number | null;
    name: string;
    description: string;
    category: string;
    cost: number | null;
    purchased?: boolean | null;
}