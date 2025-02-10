import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IList, IListItemResponse } from "../models/lists";
import { fetchListById, fetchListItemsByListId } from "../api/lists";
import { CircularProgress, Container, Typography, Card, CardHeader, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box, Radio } from "@mui/material";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import ListItemModal from "../components/ListItemModal";
import { NumericFormat } from "react-number-format";
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

    const { data: listItems, isLoading: isLoadingListItems } = useQuery<IListItemResponse>({
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
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <StyledCardHeader
                    title={list?.name}
                    subheader={list?.description}
                    titleTypographyProps={{ variant: 'h6', fontWeight: "bold" }}
                    subheaderTypographyProps={{ variant: 'body2', color: "rgba(255, 255, 255, 0.7)" }}
                />
                <CardContent>
                    <Box>
                        <Typography variant="h6" sx={{ display: "inline", mr: 0.7}}>
                            Your list total is
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", display: "inline" }}>
                            <NumericFormat
                                value={listItems?.totalCost}
                                displayType='text'
                                thousandSeparator={true}
                                prefix='$'
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </Typography>
                    </Box>
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