import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../../../shared/store/store.ts';
import { register } from '../../store/authThunks.ts';

interface RegistrationFormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

const RegistrationForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [form, setForm] = useState<RegistrationFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match!" });
            return;
        }

        try {
            const { confirmPassword, ...requestData } = form;
            await dispatch(register(requestData)).unwrap();
        } catch (err: any) {
            if (Array.isArray(err)) {
                const formattedErrors: { [key: string]: string } = {};
                err.forEach((errorObj: { field: string; message: string }) => {
                    formattedErrors[errorObj.field] = errorObj.message;
                });
                setErrors(formattedErrors);
            } else {
                setErrors({ general: "Registration failed. Please check your details." });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Username"
                name="name"
                value={form.name}
                onChange={handleChange}
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
            />
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
            <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
            />
            {errors.general && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {errors.general}
                </Typography>
            )}
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
                Sign Up
            </Button>
        </form>
    );
};

export default RegistrationForm;
