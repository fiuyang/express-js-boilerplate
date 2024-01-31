import express from "express";;
import {errorMiddleware} from "../middleware/error-middleware.js";
import {Router} from "../route/api.js";

export const web = express();

web.use(express.json());
web.use(Router);
web.use(errorMiddleware);
