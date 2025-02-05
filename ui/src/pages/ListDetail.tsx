import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IListItem } from "../models/lists";
import { fetchListItemsByListId } from "../api/lists";
import { Avatar, CircularProgress, Container, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

function ListDetail() {
    const { id } = useParams();

    const {data: listItems, isLoading } = useQuery<IListItem[]>({
        queryKey: ['listItem', id],
        queryFn: () => fetchListItemsByListId(id),
        enabled: !!id
    });

    if (isLoading) return <CircularProgress />;

    return (
        <Container maxWidth={false}>
            <List>
                {listItems?.map((listItem) => (
                    <ListItem key={listItem.id}>
                        <ListItemAvatar>
                        <Avatar>
                            X
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={listItem.name} secondary={listItem.description} />
                    </ListItem>
                ))}
            </List>
        </Container>
    )
}

export default ListDetail;