import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import apiRouter from './routes';

const PORT = process.env.PORT || (process.env.APPLICATION_ENV === 'local' ? 3001 : 3000);

const app = express();

app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use(cors());
app.use(morgan('common'));

if (process.env.APPLICATION_ENV === 'local') app.use(apiRouter);
else app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
