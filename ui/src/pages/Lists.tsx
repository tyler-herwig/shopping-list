import React, { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { fetchListsByUserId } from "../api/lists";
import { IListResponse } from "../models/lists";
import { Container, CircularProgress, Grid, Box, TextField, InputAdornment, IconButton, Skeleton, Backdrop } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear'; 
import ListCard from "../components/ListCard";
import ListModal from "../components/ListModal";
import { useBottomNavbar } from "../context/BottomNavbarContext";
import Header from "../components/Header";
import { debounce } from 'lodash';

interface ListsProps {
    completed: boolean;
}

const Lists: React.FC<ListsProps> = ({ completed }) => {
    const { user, isUserLoaded } = useUserContext();
    const { openListModal, handleOpenListModal, handleCloseModal } = useBottomNavbar();
    const [selectedListId, setSelectedListId] = useState<number | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [internalSearchTerm, setInternalSearchTerm] = useState<string>('');

    const handleEditClick = (listId: number | undefined) => {
        setSelectedListId(listId);
        handleOpenListModal();
    };

    const debouncedSearchTerm = useMemo(() => debounce((term: string) => {
        setSearchTerm(term);
    }, 1000), []);

    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery<IListResponse>({
        queryKey: ["lists", user?.user_id, searchTerm, completed],
        queryFn: ({ pageParam = 1 }) => fetchListsByUserId(user?.user_id, completed, searchTerm, pageParam, 10),
        getNextPageParam: (lastPage) => {
            // Determine if there are more pages based on the response
            return lastPage.current_page < lastPage.total_pages ? lastPage.current_page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!user?.user_id,
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInternalSearchTerm(value);
        debouncedSearchTerm(value);
    };

    const handleClearSearch =() => {
        setInternalSearchTerm('');
        setSearchTerm('');
    }

    const isDataReady = !isLoading && data?.pages?.[0]?.total !== undefined;

    return (
        <Box
            className="lazy-load-container"
            sx={{height: "95vh", overflowY: "auto"}}
            onScroll={loadMore}
        >
            <Header
                title={!isUserLoaded ? <Skeleton variant="text" width={150} height={50} /> : `Hi ${user?.first_name}!`}
                subTitle={!isDataReady ? <Skeleton variant="text" width={200} height={32} /> : `You have ${data?.pages?.[0]?.total} ${!completed ? 'active' : 'completed'} lists.`}
            />
            <Container
                maxWidth="lg"
                sx={{ mb: 15}}
            >
                <TextField 
                    label="Search lists" 
                    variant="outlined" 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px'}, mb: 3, width: '100%' }}
                    onChange={handleSearchChange}
                    value={internalSearchTerm}
                    disabled={isLoading}
                    slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          endAdornment: internalSearchTerm && (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClearSearch} edge="end">
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        },
                      }}
                />
                <Grid container spacing={3}>
                    {data?.pages.map((page) =>
                        page.lists.map((list) => (
                            <Grid item xs={12} sm={6} key={list.id}>
                                <Box>
                                    <ListCard
                                        list={list}
                                        handleEditClick={handleEditClick}
                                        completed={completed}
                                    />
                                </Box>
                            </Grid>
                        ))
                    )}
                </Grid>

                {isFetchingNextPage && (
                    <Box display="flex" justifyContent="center" mt={5}>
                        <CircularProgress />
                    </Box>
                )}
            </Container>

            <ListModal 
                userId={user?.user_id} 
                open={openListModal} 
                handleClose={() => {
                    setSelectedListId(undefined);
                    handleCloseModal();
                }} 
                listId={selectedListId}
            />
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading || (isFetching && !isFetchingNextPage)}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default Lists;