import { Button, Typography, TextField, Dialog, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, InputAdornment, IconButton, Box, styled } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewListItem } from '../api/lists';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { NumericFormat } from 'react-number-format';

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
        name: Yup.string()
            .required('Name is required')
            .max(100, 'Name must be less than 100 characters'),
        description: Yup.string()
            .max(500, 'Description must be less than 500 characters')
    });

    return (
        <Dialog open={open} onClose={handleClose} fullScreen={true}>
            <StyledBox>
                <div>
                    <IconButton onClick={handleClose} aria-label="close" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ display: "inline"}}>New List Item</Typography>
                </div>
            </StyledBox>
            <DialogContent>
                <Formik
                    initialValues={{
                        listId: listId || null,
                        name: '',
                        description: '',
                        category: '',
                        cost: null
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        const sanitizedValues = {
                            ...values,
                            cost: String(values.cost).replace(/,/g, '')
                        };
                        
                        mutate({ ...sanitizedValues, cost: parseFloat(sanitizedValues.cost) });
                        resetForm();
                    }}                    
                >
                    {({ errors, touched, handleChange, handleBlur, values, isValid, dirty }) => (
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
                                    sx={{ borderRadius: '15px' }}
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
                            <Field name="cost">
                                {({ field, form }: FieldProps) => (
                                    <NumericFormat
                                        {...field}
                                        customInput={TextField}
                                        fullWidth
                                        label="Cost"
                                        margin="normal"
                                        variant="outlined"
                                        thousandSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        allowNegative={false}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        error={Boolean(form.touched.cost && form.errors.cost)}
                                        helperText={form.touched.cost && typeof form.errors.cost === "string" ? form.errors.cost : ""}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                            borderRadius: "15px",
                                            },
                                        }}
                                    />
                                )}
                            </Field>

                            {isError && <Typography color="error">Error adding list item!</Typography>}
                            <DialogActions>
                                <Button 
                                    type="submit" 
                                    color="primary" 
                                    disabled={!isValid || !dirty}
                                    sx={{ position: "fixed", top: 18, right: 18, color: 'white' }}
                                >
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

export default ListItemModal;