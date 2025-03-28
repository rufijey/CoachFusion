import React from 'react';
import { Container } from '@mui/material';
import AddPortfolioForm from '../../../modules/coaches/components/AddPortfolioForm/AddPortfolioForm.tsx';

const AddPortfolioPage: React.FC = () => {

    return (
        <Container maxWidth="lg">
            <AddPortfolioForm />
        </Container>
    );
};

export default AddPortfolioPage;
