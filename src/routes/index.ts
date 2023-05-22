import { Router } from 'express';

import { v1Router } from './v1';

const router = Router();

router.use('/v1/api', v1Router);

export default router;
