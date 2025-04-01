import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Loader from '../../../../shared/components/UI/loader/Loader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../shared/store/store.ts';
import { fetchUser } from '../../../users/store/userSlice.ts';
import { ICoachProfile, ISpecialization, WorkMode } from '../../../users/store/userInterfaces.ts';
import { SpecializationService } from '../../services/SpecializationService.ts';
import { useNavigate } from 'react-router-dom';
import { CoachService } from '../../services/CoachService.ts';
import CoachPortfolio from '../CoachPortfolio/CoachPortfolio.tsx';

const CoachProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state: RootState) => state.user);
    const [specializations, setSpecializations] = useState<ISpecialization[]>([]);

    const [coachProfile, setCoachProfile] = useState<ICoachProfile>({
        id: 0,
        description: ' ',
        city: ' ',
        experience: 0,
        workMode: WorkMode.BOTH,
        specializations: [{ id: 0, title: '' }],
        portfolioItems: [],
    });

    async function fetchSpecializations(): Promise<void> {
        try {
            const res = await SpecializationService.getAll();
            setSpecializations(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchSpecializations();

        if (!user) {
            dispatch(fetchUser());
        } else if (user.coachProfile) {
            setCoachProfile(user.coachProfile);
        }
    }, [dispatch, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCoachProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleWorkModeChange = (e: SelectChangeEvent<WorkMode>) => {
        setCoachProfile((prev) => ({ ...prev, workMode: e.target.value as WorkMode }));
    };

    const handleSpecializationsChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const selectedSpecs = specializations.filter(spec => selectedIds.includes(spec.id));

        setCoachProfile((prev) => ({
            ...prev,
            specializations: selectedSpecs,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (coachProfile.id) {
                const res = await CoachService.update(coachProfile);
                console.log(res);
            } else {
                const res = await CoachService.post(coachProfile);
                console.log(res);
            }
            dispatch(fetchUser());
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddPortfolio = () => {
        navigate('/add-portfolio');
    };

    if (loading) return <Loader />;
    if (!user) return <div></div>;

    return (
        <div className='profile_container'>
            <div className='paper'>
                <div className='formContainer'>
                    <TextField
                        label="Description"
                        name="description"
                        value={coachProfile.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={5}
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={coachProfile.city}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Experience (years)"
                        name="experience"
                        type="number"
                        value={coachProfile.experience}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Work Mode</InputLabel>
                        <Select
                            value={coachProfile.workMode}
                            onChange={handleWorkModeChange}
                            label="Work Mode"
                        >
                            <MenuItem value={WorkMode.ONLINE}>Online</MenuItem>
                            <MenuItem value={WorkMode.OFFLINE}>Offline</MenuItem>
                            <MenuItem value={WorkMode.BOTH}>Both</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Specializations</InputLabel>
                        <Select
                            multiple
                            value={coachProfile.specializations.map(spec => spec.id)}
                            onChange={handleSpecializationsChange}
                            label="Specializations"
                            renderValue={(selected) =>
                                specializations
                                    .filter(spec => selected.includes(spec.id))
                                    .map(spec => spec.title)
                                    .join(', ')
                            }
                        >
                            {specializations.map((spec) => (
                                <MenuItem key={spec.id} value={spec.id}>
                                    {spec.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {user.coachProfile && user.coachProfile.id ? 'Save Changes' : 'Create Profile'}
                    </Button>
                </div>
            </div>
            <Button onClick={handleAddPortfolio} variant="outlined" color="inherit" style={{ marginTop: '20px' }}>
                Add Portfolio Item
            </Button>

            <CoachPortfolio portfolioItems={coachProfile.portfolioItems} />
        </div>
    );
};

export default CoachProfile;
