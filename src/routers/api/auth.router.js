import { Router } from "express";
import { usersManager } from "../../data/manager.mongo.js";

const authRouter = Router();

const registerCb = async (req, res, next) => {
  try {
    const {
      method,
      originalUrl: url,
      first_name,
      last_name,
      email,
      age,
      password,
    } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      const error = new Error("Datos inválidos o insuficientes");
      error.status = 401;
      throw error;
    }

    let user = await usersManager.readBy({ email });
    if (user) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    user = await usersManager.createOne(req.body);
    const data = { method, url, message: "Usuario registrado correctamente" };
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const loginCb = async (req, res, next) => {

  try {
    const { method, originalUrl: url } = req;
    const message = "Inicio exitoso (200) 👍";
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Datos inválidos");
      error.status = 400; 
      throw error;
    }

    let user = await usersManager.readBy({ email });
    if (!user) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }
    if (user.password !== req.body.password) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    const opts = { maxAge: 12 * 24 * 60 * 60 * 1000, signed: true };
    const data = { method, url, message };

    res
      .status(200)
      .cookie("user_id", user._id, opts)
      .cookie("role", user.role, opts)
      .cookie("email", user.email, opts)
      .json(data);
  } catch (error) {
    next(error);
  }
};

const signoutCb = (req, res, next) => {
  try {
    const { method, originalUrl: url } = req;
    const message = "Desconectado exítosamente (200) 👍";
    const data = { method, url, message };
    res.status(200).clearCookie("user_id").clearCookie("role").clearCookie("email").json(data)
  } catch (error) {
    next(error);
  }
};





const onlineCb = async (req, res, next) => {
  try {
    const { method, originalUrl: url } = req;
    const {user_id, email, role} =req.signedCookies
      let user = await usersManager.readById(user_id );
    if (!user) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }
    const data = {method, url, user: {user_id, email, role, avatar: user.avatar} };
    res.status(200).json(data)

  } catch (error) {
    next(error);
  }
};

authRouter.post("/register", registerCb);
authRouter.post("/login", loginCb);
authRouter.post("/signout", signoutCb);
authRouter.post("/online", onlineCb);

export default authRouter;
