import axios from '../utils/axiosConfig';
import { IList, IListItem, IListItemResponse, IListResponse } from '../models/lists';

export const fetchListsByUserId = async (userId: string | undefined, page: number | unknown = 1, limit: number = 10): Promise<IListResponse> => {
    const response = await axios.get<{ lists: IList[], total: number, totalPages: number, currentPage: number }>(`/lists?userId=${userId}&page=${page}&limit=${limit}`);

    return response.data;
}

export const fetchListById = async (id: string | undefined): Promise<IList> => {
    const response = await axios.get<{ list: IList }>(`/lists/${id}`);

    return response.data.list;
}

export const createNewList = async (list: IList) => {
    const response = await axios.post<{ list: IList }>('/lists', list);

    return response.data;
}

export const deleteList = async(id: number | undefined) => {
    const response = await axios.delete<number>(`/lists/${id}`);

    return response;
}

export const fetchListItemsByListId = async (id: string | undefined): Promise<IListItemResponse> => {
    const response = await axios.get<{ listItems: IListItem[], totalCost: number }>(`/list-items?listId=${id}`);

    return response.data;
}

export const createNewListItem = async (listItem: IListItem) => {
    const response = await axios.post<IListItem>('/list-items', listItem);

    return response.data;
}