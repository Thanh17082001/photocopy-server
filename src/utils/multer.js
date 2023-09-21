import multer from 'multer';
import path from 'path';

const upload = function(folder=''){
        return multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    console.log(path.dirname(__dirname));
                    cb(null, path.join(path.dirname(__dirname), 'public',folder));
                },
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                    
                },
            }),
            fileFilter: (req, file, cb) => {
                let ext = path.extname(file.originalname);
                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    cb(new Error('File type is not supported'), false);
                    return;
                }
                cb(null, true);
            },
        });
}
export default upload;
