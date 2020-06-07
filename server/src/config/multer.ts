import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..','..', 'uploads'),
        //callback-funcoa chamada depois que terminar de processar o upload
        filename: (request, file, callback ) => {
            const hash = crypto.randomBytes(6).toString('hex');
            const filename = `${hash}-${file.originalname}`;
            callback(null, filename);
        }
    })
}