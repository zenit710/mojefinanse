import * as express from "express";
import * as morgan from "morgan";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as path from "path";
import mongoose = require("mongoose");
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

// import routes
import * as IndexRouter from "./routes/IndexRoutes";

const DATABASE: string = "mongodb://localhost/moje-finanse";
const APP_PORT: number = 8080; //process.env.PORT || 8080

export class Server
{
    private app: express.Application;

    constructor()
    {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void
    {
        // static files directory (js, css, etc.)
        this.app.use(express.static(path.join(__dirname, "../client/dist")));

        // views directory
        this.app.set("views", path.join(__dirname, "../client/views"));
        this.app.set("view engine", "ejs");
        this.app.engine("html", require("ejs").renderFile);

        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;

        mongoose.connect(DATABASE, {useMongoClient: true}, (err: any) => {
            if (err) {
                return err;
            } else {
                console.log("connected to: " + DATABASE);
            }
        });

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.use(methodOverride());

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        this.app.use(errorHandler());
    }

    private routes(): void
    {
        let router: express.Router = express.Router();

        router.use("/", IndexRouter);

        this.app.use(router);
    }

    public getApp(): express.Application
    {
        return this.app;
    }
}

let httpserver: Server = new Server();
let app: express.Application = httpserver.getApp();
app.set("port", APP_PORT);

const server: http.Server = http.createServer(app);
server.listen(APP_PORT);
server.on("error", onError);
server.on("listening", onListening);

function onListening(): void
{
    let addr: any = server.address(),
        bind: string = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

    console.log("Listening on " + bind);
}

function onError(error: any): void
{
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind: string = typeof APP_PORT === "string"
        ? "Pipe " + APP_PORT
        : "Port " + APP_PORT;

    // handle specific listen errors with friendly messages
    switch (error.code)
    {
        case "EACCES":
            console.error(bind + " requires elevated privilages");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}