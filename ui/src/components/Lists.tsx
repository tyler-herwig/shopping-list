import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../context/UserContext';
import { fetchListsByUserId } from '../api/lists';
import { IList } from '../models/lists';
import { Container, CircularProgress, Grid } from '@mui/material';
import { Link } from 'react-router';
import ListCard from './ListCard';
import ListModal from './ListModal';
import { useBottomNavbar } from '../context/BottomNavbarContext';

const Lists: React.FC = () => {
    const { userId } = useUserContext();
    const { openListModal, handleCloseModal } = useBottomNavbar();

    const {data: lists, isLoading } = useQuery<IList[]>({
        queryKey: ['lists', userId],
        queryFn: () => fetchListsByUserId(userId),
        enabled: !!userId
    });

    if (isLoading) return <CircularProgress />;

    return (
        <>
            <Container maxWidth={false}>
                <Grid container spacing={2}>
                    {lists?.map((list) => (
                        <Grid item xs={12} lg={4} key={list.id}>
                            <Link to={`/dashboard/lists/${list.id}`}>
                                <ListCard title={list.name} description={list.description}/>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <ListModal
                userId={userId}
                open={openListModal}
                handleClose={handleCloseModal}
            />
        </>
    )
}

export default Lists;