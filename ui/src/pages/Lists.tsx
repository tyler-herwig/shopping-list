import React, { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { fetchListsByUserId } from "../api/lists";
import { IListResponse } from "../models/lists";
import { Container, CircularProgress, Grid, Box } from "@mui/material";
import ListCard from "../components/ListCard";
import ListModal from "../components/ListModal";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import Header from "../components/Header";

const Lists: React.FC = () => {
    const { user } = useUserContext();
    const { openListModal, handleOpenListModal, handleCloseModal } = useBottomNavbar();
    const [selectedListId, setSelectedListId] = useState<number | undefined>();

    const handleEditClick = (listId: number | undefined) => {
        setSelectedListId(listId);
        handleOpenListModal();
    };

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery<IListResponse>({
        queryKey: ["lists", user?.userId],
        queryFn: ({ pageParam = 1 }) => fetchListsByUserId(user?.userId, pageParam, 10),
        getNextPageParam: (lastPage) => {
            // Determine if there are more pages based on the response
            return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!user?.userId,
    });

    const loadMore = useCallback(
        (e: React.UIEvent<HTMLElement>) => {
            const target = e.target as HTMLElement;
            const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
            if (bottom && !isLoading && !isFetchingNextPage && hasNextPage) {
                fetchNextPage(); // Load the next page when the user scrolls to the bottom
            }
        },
        [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
    );    

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            className="lazy-load-container"
            sx={{height: "100vh", overflowY: "auto"}}
            onScroll={loadMore}
        >
            <Header
                title={`Hi ${user?.firstName}!`}
                subTitle={`You have ${data?.pages?.[0]?.total || 0} active lists.`}
            />
            <Container
                maxWidth="lg"
                sx={{ mb: 15}}
            >
                <Grid container spacing={3}>
                    {data?.pages.map((page) =>
                        page.lists.map((list) => (
                            <Grid item xs={12} sm={6} key={list.id}>
                                <Box>
                                    <ListCard
                                        id={list.id}
                                        title={list.name}
                                        description={list.description}
                                        count={list.listItemCount}
                                        handleEditClick={handleEditClick}
                                    />
                                </Box>
                            </Grid>
                        ))
                    )}
                </Grid>

                {isFetchingNextPage && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                )}
            </Container>

            <ListModal 
                userId={user?.userId} 
                open={openListModal} 
                handleClose={() => {
                    setSelectedListId(undefined);
                    handleCloseModal();
                }} 
                listId={selectedListId}
            />
        </Box>
    );
};

export default Lists;