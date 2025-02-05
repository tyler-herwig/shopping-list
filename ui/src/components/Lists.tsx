import React from 'react';
import ShoppingListModal from './ListModal';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '../context/UserContext';
import { fetchListsByUserId } from '../api/lists';
import { IList } from '../models/lists';
import { Container, CircularProgress, Grid } from '@mui/material';
import { Link } from 'react-router';
import ListCard from './ListCard';

const ShoppingLists: React.FC = () => {
    const { userId } = useUserContext();

    const {data: lists, isLoading } = useQuery<IList[]>({
        queryKey: ['lists', userId],
        queryFn: () => fetchListsByUserId(userId),
        enabled: !!userId
    });

    if (isLoading) return <CircularProgress />;

    return (
        <Container maxWidth={false}>
            <ShoppingListModal/>
            <Grid container spacing={2}>
                {lists?.map((list) => (
                    <Grid item xs={12} lg={4}>
                        <Link to={`/dashboard/lists/${list.id}`} key={list.id}>
                            <ListCard title={list.name} description={list.description}/>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ShoppingLists;