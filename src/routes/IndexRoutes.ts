import { Router, Response, Request } from "express";
import { IndexController } from "../controllers/IndexController";

let indexController: IndexController = new IndexController();
let router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    indexController.indexAction(req, res);
});

export = router;