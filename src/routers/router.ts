import * as express from 'express';
import * as path from "path";

const indexUrl = '../../dist/index.html';

const router: express.Router = express.Router();

router.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, indexUrl));
});

export default  router;
