// create a user get route
import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'User get route'
    });
});


export default router;