import React, { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import useErrorHandling from '../hooks/useErrorHandling';

interface ListModalProps {
    userId: string | undefined;
    open: boolean;
    handleClose: () => void;
}

const ListModal: React.FC<ListModalProps> = ({ userId, open, handleClose }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { errorMessage, handleError, clearError } = useErrorHandling();

    useEffect(() => {
        clearError();
      }, [open]);

    const { mutate } = useMutation({
        mutationFn: createNewList,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            handleClose();
            navigate(`/dashboard/lists/${data.list.id}`);
        },
        onError: (error) => {
            handleError(error);
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
                    {({ errors, touched, handleChange, handleBlur, isValid, dirty }) => (
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
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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

export default ListModal;