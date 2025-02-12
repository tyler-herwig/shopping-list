import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { fetchListsByUserId } from "../api/lists";
import { IList } from "../models/lists";
import { Container, CircularProgress, Grid, Box } from "@mui/material";
import ListCard from "./ListCard";
import ListModal from "./ListModal";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import Header from "./Header";

const Lists: React.FC = () => {
    const { user } = useUserContext();
    const { openListModal, handleCloseModal } = useBottomNavbar();

    const { data: lists, isLoading } = useQuery<IList[]>({
        queryKey: ["lists", user?.userId],
        queryFn: () => fetchListsByUserId(user?.userId),
        enabled: !!user?.userId,
    });

    if (isLoading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );

    return (
        <>
            <Header
                title={`Hi ${user?.firstName}!`}
                subTitle={`You have ${lists?.length || 0} active lists.`}
            />
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

            <ListModal userId={user?.userId} open={openListModal} handleClose={handleCloseModal} />
        </>
    );
};

export default Lists;