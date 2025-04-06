import React from 'react';
import { Container } from '@mui/material';
import CoachProfile from '../../../modules/coaches/components/CoachProfile/CoachProfile.tsx';

const CoachProfilePage: React.FC = () => {


    return (
        <Container maxWidth="lg">
            <CoachProfile />
        </Container>
    );
};

export default CoachProfilePage;
