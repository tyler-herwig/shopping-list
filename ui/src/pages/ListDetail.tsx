import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IList, IListItem, IListItemResponse } from "../models/lists";
import { fetchListById, fetchListItemsByListId } from "../api/lists";
import { CircularProgress, Container, Typography, Card, CardHeader, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box, Radio, Chip, Drawer, IconButton, Button } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";
import { NumericFormat } from "react-number-format";
import { styled } from "@mui/system";
import { Close as CloseIcon } from "@mui/icons-material";
import Header from "../components/Header";

const ListDetail: React.FC = () => {
    const { id } = useParams();
    const listId = id ? parseInt(id) : undefined;
    const { openListItemModal, handleOpenListItemModal, handleCloseModal } = useBottomNavbar();

    const { data: list, isLoading: isLoadingList } = useQuery<IList>({
        queryKey: ['list', listId],
        queryFn: () => fetchListById(listId),
        enabled: !!listId
    });

    const { data: listItems, isLoading: isLoadingListItems } = useQuery<IListItemResponse>({
        queryKey: ['listItems', listId],
        queryFn: () => fetchListItemsByListId(listId),
        enabled: !!listId
    });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IListItem | null>(null);
    const [selectedListItemId, setSelectedListItemId] = useState<number | undefined>();

    const handleListItemClick = (item: IListItem) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleEditClick = (listItemId: number | undefined, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setSelectedListItemId(listItemId);
        handleOpenListItemModal();
    };

    if (isLoadingList || isLoadingListItems) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
        <Header
            title="You have..."
            subTitle={`${listItems?.listItems.length} active list items`}
        />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, mb: 15 }}>
                <StyledCardHeader
                    title={list?.name}
                    subheader={list?.description}
                    titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }}
                    subheaderTypographyProps={{ variant: 'body2', color: "rgba(255, 255, 255, 0.7)" }}
                />
                <CardContent>
                    {!!listItems?.totalCost && (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ display: "inline", mr: 0.7 }}>
                                Your list total is
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", display: "inline" }}>
                                <NumericFormat
                                    value={listItems?.totalCost}
                                    displayType="text"
                                    thousandSeparator={true}
                                    prefix="$"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Typography>
                        </Box>
                    )}
                    {listItems?.listItems.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No items found.
                        </Typography>
                    ) : (
                        <List>
                            {listItems?.listItems.map((listItem) => (
                                <ListItem
                                    key={listItem.id}
                                    sx={{ borderBottom: "1px solid #ddd", "&:last-child": { borderBottom: "none" } }}
                                    onClick={() => handleListItemClick(listItem)}
                                >
                                    <ListItemAvatar>
                                        <Radio
                                            sx={{
                                                color: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)",
                                                "&.Mui-checked": {
                                                    color: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)"
                                                }
                                            }}
                                            value={listItem.id}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={listItem.name}
                                        secondary={listItem.description}
                                        primaryTypographyProps={{ variant: 'h6' }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                    <Button 
                                        onClick={(e) => handleEditClick(listItem.id, e)}
                                    >
                                        Edit
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <ListItemModal 
                listId={listId} 
                open={openListItemModal} 
                handleClose={() => {
                    setSelectedListItemId(undefined);
                    handleCloseModal();
                }} 
                listItemId={selectedListItemId} 
            />

            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: "100%",
                        padding: "20px",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px"
                    }
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <IconButton onClick={handleCloseDrawer} sx={{ alignSelf: "flex-end" }}>
                        <CloseIcon />
                    </IconButton>
                    {selectedItem && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {selectedItem.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedItem.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", mt: 2 }}>
                                {selectedItem.category && (
                                    <Chip label={selectedItem.category} color="primary" variant="outlined" />
                                )}
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    <NumericFormat
                                        value={selectedItem.cost}
                                        displayType="text"
                                        thousandSeparator={true}
                                        prefix="$"
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                    />
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Drawer>
        </Container>
        </>
    );
};

const StyledCardHeader = styled(CardHeader)(() => ({
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
}));

export default ListDetail;