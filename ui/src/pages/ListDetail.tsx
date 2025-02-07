import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IList, IListItem } from "../models/lists";
import { fetchListById, fetchListItemsByListId } from "../api/lists";
import { Avatar, CircularProgress, Container, Typography, Card, CardHeader, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";

const ListDetail: React.FC = () => {
    const { id } = useParams();
    const listId = id ? parseInt(id) : null;
    const { openListItemModal, handleCloseModal } = useBottomNavbar();

    const { data: list, isLoading: isLoadingList } = useQuery<IList>({
        queryKey: ['list', id],
        queryFn: () => fetchListById(id),
        enabled: !!id
    });

    const { data: listItems, isLoading: isLoadingListItems } = useQuery<IListItem[]>({
        queryKey: ['listItem', id],
        queryFn: () => fetchListItemsByListId(id),
        enabled: !!id
    });

    if (isLoadingList || isLoadingListItems) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardHeader
                    title={list?.name}
                    subheader={list?.description}
                    sx={{ backgroundColor: "#f5f5f5", textAlign: "center" }}
                    titleTypographyProps={{ variant: 'h4' }}
                    subheaderTypographyProps={{ variant: 'h6', color: 'textSecondary' }}
                />
                <CardContent>
                    {listItems?.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No items found.
                        </Typography>
                    ) : (
                        <List>
                            {listItems?.map((listItem) => (
                                <ListItem key={listItem.id} sx={{ borderBottom: "1px solid #ddd" }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "#2196f3" }}>
                                            {listItem.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={listItem.name}
                                        secondary={listItem.description}
                                        primaryTypographyProps={{ variant: 'h6' }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <ListItemModal listId={listId} open={openListItemModal} handleClose={handleCloseModal} />
        </Container>
    );
}

export default ListDetail;