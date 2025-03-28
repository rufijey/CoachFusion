import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const imageSaveOptions = {
    storage: diskStorage({
        destination: './static/images',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req: any, file: any, callback: any) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new BadRequestException('Only images (JPEG, PNG, WEBP, GIF)'), false);
        }

        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
