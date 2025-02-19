import axios from '../utils/axiosConfig';
import { IList, IListCount, IListItem, IListItemResponse, IListResponse } from '../models/lists';

export const fetchListsByUserId = async (user_id: string | undefined, completed: boolean, searchTerm: string, page: number | unknown = 1, limit: number = 10): Promise<IListResponse> => {
    const response = await axios.get<{ lists: IList[], total: number, total_pages: number, current_page: number }>(`/lists?user_id=${user_id}&completed=${completed}&search=${searchTerm}&page=${page}&limit=${limit}`);

    return response.data;
}

export const fetchListCount = async (user_id: string | undefined) => {
    const response = await axios.get<{ list_count: IListCount }>(`/lists/count?user_id=${user_id}`);
    
    return response.data.list_count;
}

export const fetchListById = async (id: number | undefined): Promise<IList> => {
    const response = await axios.get<{ list: IList }>(`/lists/${id}`);

    return response.data.list;
}

export const createNewList = async (list: IList) => {
    const response = await axios.post<{ list: IList }>('/lists', list);

    return response.data;
}

export const updateList = async (id: number | undefined, list: IList) => {
    const response = await axios.put<{ list: IList }>(`/lists/${id}`, list);

    return response.data;
}

export const deleteList = async(id: number | undefined) => {
    const response = await axios.delete<number>(`/lists/${id}`);

    return response;
}

export const fetchListItemById = async (id: number | undefined): Promise<IListItem> => {
    const response = await axios.get<{ list_item: IListItem }>(`/list-items/${id}`);

    return response.data.list_item;
}

export const fetchListItemsByListId = async (id: number | undefined): Promise<IListItemResponse> => {
    const response = await axios.get<{ list_items: { active: IListItem[], completed: IListItem[] }, total_cost: number }>(`/list-items?list_id=${id}`);

    return response.data;
}

export const createNewListItem = async (listItem: IListItem) => {
    const response = await axios.post<IListItem>('/list-items', listItem);

    return response.data;
}

export const updateListItem = async (id: number | undefined, listItem: IListItem) => {
    const response = await axios.put<{ list_item: IListItem }>(`/list-items/${id}`, listItem);

    return response.data;
}

export const deleteListItem = async(id: number | undefined) => {
    const response = await axios.delete<number>(`/list-items/${id}`);

    return response;
}