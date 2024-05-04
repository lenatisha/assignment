import { Router } from "express";
import { authTokenMiddleware } from "./middleware";
import prisma from "./prisma";

export const router = Router();

// Login route
router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  //  search for user
  const user = await prisma.user.findFirst({ where: { email } });
  //  check if user exists
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  //  check if password is correct
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // create token
  const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
  //  set token in cookie
  res.cookie("AuthToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 36000000),
  });

  res.status(200).json({ userId: user.id, userName: user.name });
});

// register user
router.route("/register").post(authTokenMiddleware, async (req, res) => {
  const { name, password, email } = req.body;
  // check if user exists
  const checkUser = await prisma.user.findFirst({ where: { email } });
  //  if user exists, return error
  if (!!checkUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  //  create user
  const user = await prisma.user.create({
    data: { name, password: bcrypt.hashSync(password, 10), email, name },
  });
  //  create token
  const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
  //  add token in cookie
  res.cookie("AuthToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 3600),
    domain: "localhost:3000",
  });
  res.status(200).json({ message: "Logged in successfully!" });
});

// verify user token
router.get("/me", authTokenMiddleware, (req, res) => {
  res.status(200).json({ id: req.user.id, name: req.user.name });
});
