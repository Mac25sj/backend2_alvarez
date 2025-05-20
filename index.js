import "dotenv/config.js";
import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import morgan from "morgan";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";

//Configuro Servidor
const server = express();
const port = process.env.PORT || 8080;
const ready = async () => {
  console.log("El servidor esta listo en el puerto:" + port);
  await dbConnect(process.env.URL_MONGO);
};
server.listen(port, ready);

//Configuración del Motor de Plantillas
server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", __dirname + "/src/views");

//Configuración de Middlewares
server.use(urlencoded({ extended: true }));
server.use(json());
server.use(express.static("public"));
server.use(morgan("dev")); //Que lo use en modo de desarrollador

//Configuración de Enrutamiento
server.use("/", router);
server.use(errorHandler);
server.use(pathHandler);
