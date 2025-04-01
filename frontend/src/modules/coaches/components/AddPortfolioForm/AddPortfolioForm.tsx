import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RxCross2 } from 'react-icons/rx';
import { TextField, Button } from '@mui/material';
import cl from './AddPortfolioForm.module.css';
import { PortfolioService } from '../../services/PortfolioService.ts';

interface ImagePreview {
    file: File;
    url: string;
}

interface PortfolioItem {
    images: ImagePreview[];
    description: string;
}

const AddPortfolioForm: React.FC = () => {
    const [portfolioItem, setPortfolioItem] = useState<PortfolioItem>({ images: [], description: '' });
    const [deleteClick, setDeleteClick] = useState(false);

    const onDrop = useCallback((acceptedImages: File[]) => {
        const newImages = acceptedImages.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPortfolioItem(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }, []);

    const handleRemoveFile = (image: ImagePreview, e: React.MouseEvent) => {
        e.stopPropagation();
        setPortfolioItem(prev => ({ ...prev, images: prev.images.filter(i => i !== image) }));
    };

    const handleSubmit = async () => {
        try {
            const res = await PortfolioService.post(portfolioItem)
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    const dropzoneClasses = [cl.dropzone, !deleteClick && cl.drz].filter(Boolean).join(' ');

    return (
        <div className={cl.container}>
            <div className={cl.form}>
                <div {...getRootProps({ className: `${dropzoneClasses} ${isDragActive ? cl.active : ''} ${isDragReject ? cl.reject : ''}` })}>
                    <input {...getInputProps()} />
                    <p className={cl.text}>Drag images or click to choose</p>
                    <div className={cl.preview__container}>
                        {portfolioItem.images.map((image, index) => (
                            <div key={index} className={cl.preview}>
                                <img src={image.url} alt="Preview" className={cl.preview__image} />
                                <RxCross2
                                    className={cl.delete}
                                    onClick={(e) => handleRemoveFile(image, e)}
                                    onMouseDown={() => setDeleteClick(true)}
                                    onMouseUp={() => setDeleteClick(false)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <TextField
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    label="Description"
                    value={portfolioItem.description}
                    onChange={(e) => setPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                    className={cl.textarea}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} className={cl.submit}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default AddPortfolioForm;
