import axios from '../utils/axiosConfig';
import { IList, IListItem, IListItemResponse } from '../models/lists';

export const fetchListsByUserId = async (userId: string | null): Promise<IList[]> => {
    const response = await axios.get<{lists: IList[] }>(`/lists?userId=${userId}`);

    return response.data.lists;
}

export const fetchListById = async (id: string | undefined): Promise<IList> => {
    const response = await axios.get<{ list: IList }>(`/lists/${id}`);

    return response.data.list;
}

export const createNewList = async (list: IList) => {
    const response = await axios.post<IList>('/lists', list);

    return response.data;
}

export const deleteList = async(id: number | undefined) => {
    const response = await axios.delete<number>(`/lists/${id}`);

    return response;
}

export const fetchListItemsByListId = async (id: string | undefined): Promise<IListItemResponse> => {
    const response = await axios.get<{listItems: IListItem[], totalCost: number }>(`/list-items?listId=${id}`);

    return response.data;
}

export const createNewListItem = async (listItem: IListItem) => {
    const response = await axios.post<IListItem>('/list-items', listItem);

    return response.data;
}