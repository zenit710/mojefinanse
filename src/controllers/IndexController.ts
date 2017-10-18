import { Request, Response } from "express";

export class IndexController
{
    public indexAction(req: Request, res: Response): void
    {
        res.end("Moje finanse");
    }
}