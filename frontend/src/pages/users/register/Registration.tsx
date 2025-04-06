import React from "react";
import { Container, Box, Typography } from "@mui/material";
import RegistrationForm from '../../../modules/users/components/RegistrationForm/RegistrationFrom.tsx';

const Register: React.FC = () => {
    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
                <RegistrationForm />
            </Box>
        </Container>
    );
};

export default Register;
