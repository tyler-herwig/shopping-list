import React, { useState } from "react";
import { Card, Typography, Box, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { styled } from "@mui/system";
import { MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList } from "../api/lists";

interface ListCardProps {
  id: number | undefined;
  title: string;
  description: string;
  count: number;
}

const ListCard: React.FC<ListCardProps> = ({ id, title, description, count }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate, isError } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['lists'] });
        setOpenDeleteDialog(false);
    }
})

  /* Settings Menu Handlers */
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  /* Card Handlers */
  const handleCardClick = () => {
    navigate(`/dashboard/lists/${id}`); 
  };

  /* Delete Handlers */
  const handleDeleteMenuOption = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      handleMenuClose(event);
      setOpenDeleteDialog(true);
  }

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  }

  const handleDelete = () => {
    mutate(id);
  }

  return (
    <>
      <StyledCard onClick={handleCardClick}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {description}
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
          <IconButton sx={{ color: "white" }} onClick={handleMenuClick}>
            <MoreHoriz />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", marginRight: 8 }}>
            {count}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem 
            onClick={handleDeleteMenuOption}
          >
            Delete
          </MenuItem>
        </Menu>
      </StyledCard>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>
          {"Delete List"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete <Typography sx={{fontWeight: 'bold', display: 'inline'}}>{title}</Typography>?
          {isError && <Typography color="error">Error deleting list!</Typography>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
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
  display: "flex",
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