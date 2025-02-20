import React, { useState } from "react";
import { Card, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Button, Divider, Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, Backdrop, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { MoreHoriz, Edit, Delete, Close, Check, Restore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList, updateList } from "../api/lists";
import { IList } from "../models/lists";
import ListItemProgressBar from "./ListItemProgressBar";
import { formatDate } from "../utils/helpers";

interface ListCardProps {
  list: IList;
  handleEditClick: (id: number | undefined) => void;
  completed: boolean;
}

const ListCard: React.FC<ListCardProps> = ({ list, handleEditClick, completed }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["list-count"], exact: false });
      setOpenDeleteDialog(false);
    },
  });

  const updateMutation = useMutation({
      mutationFn: ({ id, completed }: { id: number | undefined; completed: boolean }) =>
          updateList(id, { completed } as IList),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["lists"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["list-count"], exact: false });
      }
  });


  /* Card Handlers */
  const handleCardClick = () => {
    if (!completed) {
      navigate(`/dashboard/lists/${list.id}`);
    }
  };

  const handleMoreButton = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDrawerOpen(true);
  }

  /* Edit Handlers */
  const handleEditMenuOption = (id: number | undefined, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDrawerOpen(false);
    handleEditClick(id);
  };

  /* Delete Handlers */
  const handleDeleteMenuOption = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDrawerOpen(false);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(list.id);
  };

  /* Complete Handlers */
  const handleCompleteMenuOption = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDrawerOpen(false);
    updateMutation.mutate({ id: list.id, completed: !completed })
  }

  const StyledCard = !completed ? StyledCardActive : StyledCardCompleted;

  return (
    <>
      <StyledCard onClick={handleCardClick}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {list.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {list.description}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(0, 0, 0, 0.4)",
            borderRadius: "12px",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!completed ? (
            <IconButton sx={{ color: "white" }} onClick={(e) => handleMoreButton(e)}>
              <MoreHoriz />
            </IconButton>
          ) : (
            <IconButton sx={{ color: "white" }} onClick={handleCompleteMenuOption}>
              <Restore />
            </IconButton>
          )}
        </Box>

        {!completed ? (
          <ListItemProgressBar
            completedItems={list.completed_list_item_count}
            totalItems={list.list_item_count}
          />
        ) : (
          <Typography variant="body2" sx={{ fontSize: "0.7rem", position: "absolute", bottom: 15, right: 15 }}>
            Completed on {list.completed_date ? formatDate(list.completed_date) : ""}
          </Typography>

        )}
      </StyledCard>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
            Manage List
          </Typography>
          <IconButton sx={{ padding: 0 }} onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <List>
          <ListItem onClick={(e) => handleEditMenuOption(list.id, e)}>
            <ListItemIcon>
              <Edit/>
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <Divider />
          <ListItem onClick={handleDeleteMenuOption}>
            <ListItemIcon>
              <Delete/>
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
          <Divider />
          <ListItem onClick={handleCompleteMenuOption}>
            <ListItemIcon>
              <Check/>
            </ListItemIcon>
            <ListItemText primary="Mark Complete" />
          </ListItem>
        </List>
      </Drawer>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>{"Delete List"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <Typography sx={{ fontWeight: 'bold', display: 'inline' }}>{list.name}</Typography>?
          {deleteMutation.isError && <Typography color="error">Error deleting list!</Typography>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleteMutation.isPending || updateMutation.isPending}>
          <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const StyledCardActive = styled(Card)({
  height: "150px",
  position: "relative",
  color: "white",
  borderRadius: "16px",
  boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  background: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)",
  alignItems: "center",
  padding: "16px",
  justifyContent: "space-between",
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

const StyledCardCompleted = styled(Card)({
  height: "150px",
  position: "relative",
  color: "white",
  borderRadius: "16px",
  boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  background: "linear-gradient(135deg, #1565c0 30%, #1e88e5 100%)", // Updated to blue gradient
  alignItems: "center",
  padding: "16px",
  justifyContent: "space-between",
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


export default ListCard;