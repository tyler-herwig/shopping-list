import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IList, IListItem, IListItemResponse } from "../models/lists";
import { deleteListItem, fetchListById, fetchListItemsByListId } from "../api/lists";
import { CircularProgress, Container, Typography, Card, CardHeader, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box, Chip, Drawer, IconButton, Button, Dialog, DialogTitle, DialogActions, DialogContent, Accordion, AccordionDetails, AccordionSummary, Divider, ListItemIcon } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";
import { NumericFormat } from "react-number-format";
import { styled } from "@mui/system";
import { Close as CloseIcon, MoreHoriz, ExpandMore as ExpandMoreIcon, Close, Delete, Edit } from "@mui/icons-material";
import Header from "../components/Header";
import ListItemCheckbox from "../components/ListItemCheckbox";
import ListItemProgressBar from "../components/ListItemProgressBar";

const ListDetail: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IListItem | null>(null);
    const [selectedListItemId, setSelectedListItemId] = useState<number | undefined>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const { id } = useParams();
    const listId = id ? parseInt(id) : undefined;
    const { openListItemModal, handleOpenListItemModal, handleCloseModal } = useBottomNavbar();
    const queryClient = useQueryClient();

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

    const {mutate, isError } = useMutation({
        mutationFn: deleteListItem,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['listItems'] });
            setOpenDeleteDialog(false);
        }
    });

    /* Settings Menu Handlers */
    const handleMoreButton = (event: React.MouseEvent<HTMLElement>, listItemId: number | undefined) => {
        event.stopPropagation();
        setMenuDrawerOpen(true);
        setSelectedListItemId(listItemId);
      };      

    /* List Item Handlers */
    const handleListItemClick = (item: IListItem) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedItem(null);
    };

    /* Edit Handlers */
    const handleEditMenuOption = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setMenuDrawerOpen(false);
        handleOpenListItemModal();
    };

    /* Delete Handlers */
      const handleDeleteMenuOption = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setMenuDrawerOpen(false);
          setOpenDeleteDialog(true);
      }
    
      const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
      }
    
      const handleDelete = (listItemId: number | undefined) => {
        mutate(listItemId);
      }

    const totalItems = (listItems?.list_items?.active?.length || 0) + (listItems?.list_items?.completed?.length || 0);

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
            subTitle={`${listItems?.list_items.active.length} active list items`}
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
                    <ListItemProgressBar
                        completedItems={listItems?.list_items.completed.length}
                        totalItems={totalItems}
                    />
                    {!!listItems?.total_cost && (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" sx={{ display: "inline", mr: 0.7 }}>
                                Your list total is
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", display: "inline" }}>
                                <NumericFormat
                                    value={listItems?.total_cost}
                                    displayType="text"
                                    thousandSeparator={true}
                                    prefix="$"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Typography>
                        </Box>
                    )}
                    {listItems?.list_items.active.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No items found.
                        </Typography>
                    ) : (
                        <List>
                            {listItems?.list_items.active.map((listItem) => (
                                <ListItem
                                    key={listItem.id}
                                    sx={{ borderBottom: "1px solid #ddd", "&:last-child": { borderBottom: "none" } }}
                                    onClick={() => handleListItemClick(listItem)}
                                >
                                    <ListItemAvatar>
                                        <ListItemCheckbox 
                                            listItem={listItem}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={listItem.name}
                                        secondary={listItem.description}
                                        primaryTypographyProps={{ variant: 'h6' }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                    <IconButton onClick={(e) => handleMoreButton(e, listItem.id)}>
                                        <MoreHoriz />
                                    </IconButton>                                    
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {!!listItems?.list_items.completed.length && (
                        <Accordion
                            sx={{
                                boxShadow: "none",
                                border: "none",
                                "&:before": {
                                    display: "none", 
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="completed-items-accordion"
                                id="completed-items-accordion"
                            >
                                <Typography component="span">({listItems?.list_items.completed.length}) Completed Items</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {listItems?.list_items.completed.map((listItem) => (
                                        <ListItem
                                            key={listItem.id}
                                            sx={{ borderBottom: "1px solid #ddd", "&:last-child": { borderBottom: "none" } }}
                                            onClick={() => handleListItemClick(listItem)}
                                        >
                                            <ListItemAvatar>
                                                <ListItemCheckbox 
                                                    listItem={listItem}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={listItem.name}
                                                secondary={listItem.description}
                                                primaryTypographyProps={{ variant: 'h6', sx: { textDecoration: 'line-through' } }}
                                                secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary', sx: { textDecoration: 'line-through' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
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

            <Drawer
                anchor="bottom"
                open={menuDrawerOpen}
                onClose={() => setMenuDrawerOpen(false)}
                sx={{
                width: 'auto',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px 20px 0 0',
                    padding: '20px',
                    boxSizing: 'border-box',
                },
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Manage List Item
                </Typography>
                <IconButton sx={{ padding: 0 }} onClick={() => setMenuDrawerOpen(false)}>
                    <Close />
                </IconButton>
                </Box>

                <List>
                <ListItem onClick={(e) => handleEditMenuOption(e)}>
                    <ListItemIcon>
                    <Edit/>
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                </ListItem>
                <Divider />
                <ListItem onClick={(e) => handleDeleteMenuOption(e)}>
                    <ListItemIcon>
                    <Delete/>
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </ListItem>
                </List>
            </Drawer>

            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>
                    Delete List Item
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this list item?
                    {isError && <Typography color="error">Error deleting list item!</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDeleteDialogClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(selectedListItemId)}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
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