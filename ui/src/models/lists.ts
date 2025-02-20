export interface IListResponse {
    lists: IList[];
    total: number;
    total_pages: number;
    current_page: number;

}

export interface IList {
    id?: number;
    name?: string;
    description?: string;
    user_id?: string | null;
    list_item_count?: number;
    completed_list_item_count?: number;
    completed?: boolean;
    completed_date?: string;
}

export interface IListCount {
    active: number;
    completed: number;
}

export interface IListItemResponse {
    list_items: {
        active: IListItem[],
        completed: IListItem[]
    },
    total_cost: number
}

export interface IListItem {
    id?: number;
    list_id?: number | null;
    name: string;
    description: string;
    category: string;
    cost: number | null;
    purchased?: boolean | null;
}