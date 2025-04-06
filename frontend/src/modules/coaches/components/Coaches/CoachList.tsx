import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, CircularProgress } from '@mui/material';
import { CoachService } from '../../services/CoachService.ts';
import styles from './CoachList.module.css';

interface Coach {
    id: number;
    name: string;
    city: string;
    experience: string;
    specializations: { id: number; title: string }[];
}

const CoachList: React.FC = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchCoaches() {
            try {
                const response = await CoachService.getFiltered({});
                setCoaches(response.data);
            } catch (error) {
                console.error('Error fetching coaches:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCoaches();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;

    return (
        <div className={styles.container}>
            {coaches.map((coach) => (
                <div key={coach.id} className={styles.gridItem}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {coach.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {coach.city}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Experience: {coach.experience} years
                            </Typography>
                            <div style={{ marginTop: '10px' }}>
                                {coach.specializations.map((spec) => (
                                    <Chip key={spec.id} label={spec.title} sx={{ marginRight: 0.5, marginBottom: 0.5 }} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default CoachList;
