import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../../../shared/store/store.ts';
import { login } from '../../store/authThunks.ts';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(login(form)).unwrap();
        } catch (err: any) {
            if (Array.isArray(err)) {
                const formattedErrors: { [key: string]: string } = {};
                err.forEach((errorObj: { field: string; message: string }) => {
                    formattedErrors[errorObj.field] = errorObj.message;
                });
                setErrors(formattedErrors);
            } else {
                setErrors({ general: "Login failed. Please check your details." });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
            />
            {errors.general && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {errors.general}
                </Typography>
            )}
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
                Log In
            </Button>
        </form>
    );
};

export default LoginForm;
