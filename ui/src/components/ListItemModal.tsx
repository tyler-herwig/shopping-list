import { Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewListItem } from '../api/lists';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface ListItemModalProps {
    listId: number | null;
    open: boolean;
    handleClose: () => void;
}

const categories = ['Groceries', 'Electronics', 'Clothing', 'Books', 'Household']; // Sample categories

const ListItemModal: React.FC<ListItemModalProps> = ({ listId, open, handleClose }) => {
    const queryClient = useQueryClient();

    const { mutate, isError } = useMutation({
        mutationFn: createNewListItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listItem'] });
            handleClose();
        }
    });

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        cost: Yup.number().min(0, 'Cost must be a positive number').required('Cost is required')
    });

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New List Item</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        listId: listId || null,
                        name: '',
                        description: '',
                        category: '',
                        cost: 0
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        mutate(values);
                        resetForm();
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
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

                            {/* Category Dropdown */}
                            <FormControl fullWidth margin="normal" variant="outlined" error={touched.category && Boolean(errors.category)}>
                                <InputLabel>Category</InputLabel>
                                <Field
                                    as={Select}
                                    name="category"
                                    label="Category"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.category}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Field>
                                {touched.category && errors.category && (
                                    <Typography color="error" variant="caption">{errors.category}</Typography>
                                )}
                            </FormControl>

                            {/* Cost Input with $ Adornment */}
                            <Field
                                as={TextField}
                                fullWidth
                                label="Cost"
                                name="cost"
                                type="number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                margin="normal"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                                error={touched.cost && Boolean(errors.cost)}
                                helperText={touched.cost && errors.cost}
                            />

                            {isError && <Typography color="error">Error adding list item!</Typography>}
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit" color="primary">
                                    Add List Item
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ListItemModal;