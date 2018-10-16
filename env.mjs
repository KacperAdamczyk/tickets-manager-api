import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const environment = dotenv.config();
dotenvExpand(environment);
