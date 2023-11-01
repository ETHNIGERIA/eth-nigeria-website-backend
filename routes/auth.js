const express = require('express');
const { login, setRole } = require('../controller/auth');
const router = express.Router();


router.post('/login', login);

router.post('/set-role', async (req, res) => {
    try {
        const {email, role} = req.body;
        const newRole = setRole(email, role);
        if(!newRole){
            return res.status(400).send('user role not set'); 
        }
        return res.status(200).send(`${email} now has ${role} role`);
    } catch (e){
        return res.status(500).json({success: false, error: e});
    }
});

module.exports = router;
