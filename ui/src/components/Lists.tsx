import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { fetchListsByUserId } from "../api/lists";
import { IList } from "../models/lists";
import { Container, CircularProgress, Grid, Box, Typography, Avatar } from "@mui/material";
import ListCard from "./ListCard";
import ListModal from "./ListModal";
import { useBottomNavbar } from "../context/BottomNavbarContext";

const Lists: React.FC = () => {
    const { userId, userName } = useUserContext();
    const { openListModal, handleCloseModal } = useBottomNavbar();

    const { data: lists, isLoading } = useQuery<IList[]>({
        queryKey: ["lists", userId],
        queryFn: () => fetchListsByUserId(userId),
        enabled: !!userId,
    });

    if (isLoading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
                sx={{
                    width: "100%",
                    backgroundColor: "#f4f4f4",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    padding: "20px",
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Hi {userName}!
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        You have {lists?.length || 0} active lists.
                    </Typography>
                </Box>
                <Avatar sx={{ width: 56, height: 56 }}>
                    {userName?.charAt(0).toUpperCase()}
                </Avatar>
            </Box>
            <Container maxWidth="lg" sx={{ mb: 15 }}>
                <Grid container spacing={3}>
                    {lists?.map((list) => (
                        <Grid item xs={12} sm={6} md={4} key={list.id}>
                            <Box
                                
                            >
                                <ListCard
                                    id={list.id}
                                    title={list.name}
                                    description={list.description}
                                    count={list.listItemCount}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <ListModal userId={userId} open={openListModal} handleClose={handleCloseModal} />
        </>
    );
};

export default Lists;