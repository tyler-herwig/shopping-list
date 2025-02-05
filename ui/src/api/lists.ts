import axios from '../utils/axiosConfig';
import { IList, IListItem } from '../models/lists';

export const fetchListsByUserId = async (userId: string | null): Promise<IList[]> => {
    const response = await axios.get<{lists: IList[] }>(`/lists?userId=${userId}`);

    return response.data.lists;
}

export const createNewList = async (list: IList) => {
    const response = await axios.post<IList>('/lists', list);

    return response.data;
}

export const fetchListItemsByListId = async (id: string | undefined): Promise<IListItem[]> => {
    const response = await axios.get<{listItems: IListItem[] }>(`/list-items?listId=${id}`);

    return response.data.listItems;
}