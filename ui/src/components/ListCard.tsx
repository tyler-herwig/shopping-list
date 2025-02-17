import React, { useState } from "react";
import { Card, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Button, Divider, Dialog, DialogActions, DialogContent, DialogTitle, ListItemIcon, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import { MoreHoriz, Edit, Delete, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList } from "../api/lists";
import { IList } from "../models/lists";

interface ListCardProps {
  list: IList;
  handleEditClick: (id: number | undefined) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, handleEditClick }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isError } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      setOpenDeleteDialog(false);
    },
  });

  /* Card Handlers */
  const handleCardClick = () => {
    navigate(`/dashboard/lists/${list.id}`);
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
    mutate(list.id);
  };

  // Calculate the percentage
  const completionPercentage = list.listItemCount ? ((list.completedListItemCount || 0) / list.listItemCount) * 100 : 0;

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
          <IconButton sx={{ color: "white" }} onClick={(e) => handleMoreButton(e)}>
            <MoreHoriz />
          </IconButton>
        </Box>

        <Box sx={{ width: "100%", marginTop: 2 }}>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ height: 6, borderRadius: 2 }}
          />
          <Typography variant="body2" sx={{ textAlign: "right", marginTop: 1 }}>
            {list.completedListItemCount}/{list.listItemCount}
          </Typography>
        </Box>
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
        </List>
      </Drawer>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>{"Delete List"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <Typography sx={{ fontWeight: 'bold', display: 'inline' }}>{list.name}</Typography>?
          {isError && <Typography color="error">Error deleting list!</Typography>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const StyledCard = styled(Card)({
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

export default ListCard;