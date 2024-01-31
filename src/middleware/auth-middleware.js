import jwt from 'jsonwebtoken';
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.sendStatus(401);
        console.log(authHeader); // Bearer token
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.JWT_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403);
                req.user = decoded.email;
                next();
            }
        );
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
