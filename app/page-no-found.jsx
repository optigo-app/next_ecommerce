"use client";

import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';

export default function PageNotFound() {
    const navigate = useNextRouterLikeRR();


    return (
        <Container
            maxWidth="md"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                py: 8,
            }}
        >

            <Typography variant="h3" component="h1" gutterBottom>
                Page Not Found
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
                Oops! The page you are looking for does not exist or has been moved.
            </Typography>

            <Button
                variant="contained"
                size="large"
                onClick={() => navigate.push('/')}
                sx={{ mt: 2 }}
            >
                Go to Homepage
            </Button>
        </Container>
    );
}
