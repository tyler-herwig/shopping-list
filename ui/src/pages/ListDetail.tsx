import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IListItem } from "../models/lists";
import { fetchListItemsByListId } from "../api/lists";
import { Avatar, CircularProgress, Container, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";

function ListDetail() {
    const { id } = useParams();
    const listId = id ? parseInt(id) : null;
    const { openListItemModal, handleCloseModal } = useBottomNavbar();

    const { data: listItems, isLoading } = useQuery<IListItem[]>({
        queryKey: ['listItem', id],
        queryFn: () => fetchListItemsByListId(id),
        enabled: !!id
    });

    if (isLoading) return <CircularProgress />;

    return (
        <>
            <Container maxWidth={false}>
                {listItems?.length === 0 ? (
                    <Typography variant="h6" color="textSecondary">
                        No items found.
                    </Typography>
                ) : (
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
                )}
            </Container>

            <ListItemModal
                listId={listId}
                open={openListItemModal}
                handleClose={handleCloseModal}
            />
        </>
    );
}

export default ListDetail;