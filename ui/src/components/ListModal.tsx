import React from 'react';
import {
    Button,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New List</DialogTitle>
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
                            />
                            {isError && <Typography color="error">Error adding list!</Typography>}
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit" color="primary">
                                    Add List
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ListModal;