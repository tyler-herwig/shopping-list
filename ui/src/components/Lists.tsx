import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { fetchListsByUserId } from "../api/lists";
import { IList } from "../models/lists";
import { Container, CircularProgress, Grid, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Fixed incorrect import
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
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Hi {userName}!
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Here are your lists...
                </Typography>

                <Grid container spacing={3}>
                    {lists?.map((list) => (
                        <Grid item xs={12} sm={6} md={4} key={list.id}>
                            <Box
                                component={Link}
                                to={`/dashboard/lists/${list.id}`}
                                sx={{
                                    textDecoration: "none",
                                    display: "block",
                                    "&:hover .list-card": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <ListCard
                                    title={list.name}
                                    description={list.description}
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