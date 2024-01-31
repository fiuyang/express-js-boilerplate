import userService from "../service/user-service.js";

const get = async (req, res, next) => {
    try {
        const email = req.user;
        const result = await userService.get(email);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user;
        const request = req.body;
        request.username = username;

        const result = await userService.update(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    get,
    update,
}
