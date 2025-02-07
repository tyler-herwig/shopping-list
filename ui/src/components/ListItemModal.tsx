import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IListItem } from '../models/lists';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewListItem } from '../api/lists';

interface ListItemModalProps {
    listId: number | null;
    open: boolean;
    handleClose: () => void;
}

const ListItemModal: React.FC<ListItemModalProps> = ({ listId, open, handleClose }) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<IListItem>({
        listId: listId,
        name: '',
        description: '',
        category: '',
        cost: null,
        purchased: null
    });

    useEffect(() => {
        if (listId) {
            setFormData(prevState => ({
                ...prevState,
                listId: listId
            }));
        }
    }, [listId]);

    const {mutate, isError } = useMutation({
        mutationFn: createNewListItem,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['listItem'] });
            setFormData({ listId: listId, name: '', description: '', category: '', cost: null, purchased: null})
            handleClose();
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add New List Item
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Purchased"
                        name="purchased"
                        value={formData.purchased}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                    {isError && <Typography color="error">Error submitting data!</Typography>}
                </form>
            </Box>
        </Modal>
    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default ListItemModal;