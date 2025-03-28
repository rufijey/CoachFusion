import React from "react";
import { Container, Box, Typography } from "@mui/material";
import LoginForm from '../../../modules/users/components/LoginForm/LoginForm.tsx';

const Login: React.FC = () => {
    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <LoginForm />
            </Box>
        </Container>
    );
};

export default Login;
