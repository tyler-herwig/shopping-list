export interface IListResponse {
    lists: IList[];
    total: number;
    totalPages: number;
    currentPage: number;

}

export interface IList {
    id?: number;
    name: string;
    description: string;
    userId?: string | null;
    listItemCount?: number;
}

export interface IListItemResponse {
    listItems: {
        active: IListItem[],
        completed: IListItem[]
    },
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