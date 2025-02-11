import React from 'react';
import {
    Button,
    Typography,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    styled,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewList } from '../api/lists';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface ListModalProps {
    userId: string | null;
    open: boolean;
    handleClose: () => void;
}

const ListModal: React.FC<ListModalProps> = ({ userId, open, handleClose }) => {
    const queryClient = useQueryClient();

    const { mutate, isError } = useMutation({
        mutationFn: createNewList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            handleClose();
        }
    });

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required')
    });

    return (
        <Dialog open={open} onClose={handleClose} fullScreen={true}>
            <StyledBox>
                <div>
                    <IconButton onClick={handleClose} aria-label="close" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ display: "inline"}}>New List</Typography>
                </div>
            </StyledBox>
            <DialogContent>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        userId: userId || ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        mutate(values);
                        resetForm();
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur }) => (
                        <Form>
                            <Field
                                as={TextField}
                                fullWidth
                                label="Name"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                margin="normal"
                                variant="outlined"
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                    }
                                }}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                label="Description"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows={4}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                    }
                                }}
                            />
                            {isError && <Typography color="error">Error adding list!</Typography>}
                            <DialogActions>
                                <Button type="submit" color="primary" sx={{ position: "fixed", top: 18, right: 18, color: 'white'}}>
                                    Save
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

const StyledBox = styled(Box)({
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '16px', 
    color: 'white',
    backgroundColor: '#6a1b9a'
})

export default ListModal;