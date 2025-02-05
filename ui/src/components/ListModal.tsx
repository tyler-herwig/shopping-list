import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import React, { useState } from 'react';
import { IList } from '../models/lists';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewList } from '../api/lists';
import { useUserContext } from '../context/UserContext';

const ShoppingListModal: React.FC = () => {
    const queryClient = useQueryClient();

    const { userId } = useUserContext();

    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<IList>({
        name: '',
        description: '',
        userId: userId
    });

    const {mutate, isError } = useMutation({
        mutationFn: createNewList,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lists'] });
            setFormData({ name: '', description: '', userId: userId})
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen}>Add New List</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add New List
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
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Submit
                        </Button>
                        {isError && <Typography color="error">Error submitting data!</Typography>}
                    </form>
                </Box>
            </Modal>
        </>
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

export default ShoppingListModal;