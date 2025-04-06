import React from 'react';
import { Container } from '@mui/material';

import Profile from '../../../modules/users/components/Profile/Profile.tsx';

const ProfilePage: React.FC = () => {


    return (
        <Container maxWidth="sm">
            <Profile />
        </Container>
    );
};

export default ProfilePage;
