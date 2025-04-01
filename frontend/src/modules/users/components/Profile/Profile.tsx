import React, { useEffect, useState } from 'react';
import { TextField, Button, Avatar } from '@mui/material';
import Loader from '../../../../shared/components/UI/loader/Loader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../shared/store/store.ts';
import { fetchUser, updateUser } from '../../store/userSlice.ts';
import { UserService } from '../../services/UserService.ts';

interface ImagePreview {
    file: File;
    url: string;
}

const Profile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.user);
    const [profileImage, setProfileImage] = useState<ImagePreview>();

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImage({ file: file, url: URL.createObjectURL(file) });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (user) {
            dispatch(updateUser({ ...user, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        try {
            await UserService.update({ ...user, profileImage });
            dispatch(fetchUser());
        } catch (error) {

        }
    };

    if (loading) return <Loader />;
    if (!user) return <div></div>;

    return (
        <div className="profile_container">
            <div className="paper">
                <div className="formContainer">
                    <label htmlFor="upload-photo" className="avatarLabel">
                        <Avatar
                            src={(profileImage && profileImage.url) || user.profileImage.url}
                            className="avatar"
                            sx={{ width: 100, height: 100 }}
                        />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="fileInput"
                        id="upload-photo"
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={user.password || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;