import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IList, IListItem } from "../models/lists";
import { fetchListById, fetchListItemsByListId } from "../api/lists";
import { Avatar, CircularProgress, Container, Typography, Card, CardHeader, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";
import { styled } from "@mui/system";

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
                <StyledCardHeader
                    title={list?.name}
                    subheader={list?.description}
                    titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }}
                    subheaderTypographyProps={{ variant: 'body2', color: "rgba(255, 255, 255, 0.7)" }}
                />
                <CardContent>
                    {listItems?.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No items found.
                        </Typography>
                    ) : (
                        <List>
                            {listItems?.map((listItem) => (
                                <ListItem 
                                    key={listItem.id} 
                                    sx={{ borderBottom: "1px solid #ddd", "&:last-child": { borderBottom: "none" } }}
                                >                            
                                    <ListItemAvatar>
                                        <Avatar sx={{ background: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)" }}>
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

const StyledCardHeader = styled(CardHeader)({
    height: "150px",
    position: "relative",
    color: "white",
    borderRadius: "16px 16px 0 0",
    background: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)",
    alignItems: "center",
    textAlign: "center",
    padding: "16px",
    "::before": {
      content: '""',
      position: "absolute",
      width: "270px",
      height: "270px",
      background: "rgba(255, 255, 255, 0.1)",
      top: "-140px",
      right: "-90px",
      borderRadius: "50%",
    },
  });

export default ListDetail;