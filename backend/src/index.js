import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Define the root directory and the uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, ".."); // Go up to the root directory from src

// Now use `rootDir` to reference the uploads directory correctly
const uploadsDir = path.join(uploadDir, "uploads");

// init express
const app = express();

// init prisma client
const prisma = new PrismaClient();

// add middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173",['http://localhost:4173']], // Allow frontend to connect
    credentials: true, // Crucial for cookies
  })
);

// Initialize multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`uploads/${req.user.id}`)) {
      fs.mkdirSync(`uploads/${req.user.id}`);
    }
    cb(null, `uploads/${req.user.id}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ------------------- middleware----------------------------
function checkCookieMiddleware(req, res, next) {
  const token = req.cookies["AuthToken"];

  if (!token) return res.sendStatus(401); // if no token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, null, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

async function checkImageExist(req, res, next) {
  const filename = req.params.filename;
  const image = await prisma.image.findFirst({
    where: {
      fileName: filename,
      userIdFk: req.params.userId,
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found." });
  }
  req.image = image;
  next();
}

async function checkImageOwner(req, res, next) {
  if (req.user.id !== req.image.userIdFk) {
    return res.status(403).json({ message: "You are not authorized to view this image." });
  }
  next();
}

async function checkImageIsPublic(req, res, next) {
  if (!req.image.public) return next();

  const filename = req.params.filename;
  const userId = req.params.userId;
  const filePath = path.join(uploadsDir, `/${userId}/`, filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.status(404).send("Image not found");
      } else {
        res.status(500).send("Failed to send image");
      }
    }
  });
}

// ------------------- routes----------------------------
app.get("/health", (req, res) => {
  return res.sendStatus(200);
});

// -------------------  file routes --------------------------------
app.post("/upload", checkCookieMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) res.status(400).json({ message: "No image uploaded." });

  const image = sharp(req?.file?.path);
  const metadata = await image.metadata();

  await prisma.image
    .create({
      data: {
        fileName: req.file.filename,
        url: `/image/${req.user.id}/${req.file.filename}`,
        resolution: metadata.width + "x" + metadata.height,
        user: { connect: { id: req.user.id } },
      },
    })
    .catch((e) => {
      console.log(e);
    });
  res.status(200).json({ message: "Image uploaded successfully!", filePath: req.file.path });
});

app.get(
  "/image/:userId/:filename",
  checkImageExist,
  checkImageIsPublic,
  checkCookieMiddleware,
  checkImageOwner,
  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, `/${req.user.id}`, filename);
    // // Optional: Check if the user has permission to view the image
    // if (!fs.existsSync(filePath)) {
    //   return res.status(404).json({ message: "Image not found." });
    // }

    res.sendFile(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.status(404).send("Image not found");
        } else {
          res.status(500).send("Failed to send image");
        }
      }
    });
  }
);

app.get("/images", checkCookieMiddleware, async (req, res) => {
  const images = await prisma.image.findMany({ where: { userIdFk: req.user.id } });
  res.status(200).json(images);
});

app.delete("/image/:userId/:filename", checkCookieMiddleware, checkImageExist, checkImageOwner, (req, res) => {
  const filename = req.params.filename;
  const userId = req.params.userId;
  const filePath = path.join(uploadDir, `uploads/${userId}/${filename}`);


  fs.unlink(filePath, (err) => {
    if (!err) {
      prisma.image
        .delete({ where: { id: req.image.id } })
        .then(() => res.status(200).json({ message: "Image deleted successfully." }));
    }
    if (err)
      if (err.code === "ENOENT") {
        // No such file or directory
        res.status(404).json({ message: "Image not found." });
      } else {
        res.status(500).json({ message: "Error deleting the image." });
      }
  });
});

app.patch("/image/:userId/:filename", checkCookieMiddleware, checkImageExist, async (req, res) => {
 
  const filename = req.params.filename;
  const image = await prisma.image.update({
    where: { userIdFk: req.user.id, fileName: filename, id: req.body.id },
    data: { public: req.body.isPublic },
  });

  res.status(200).json(image);
});

// ---------------------------auth routes---------------------------

app.post("/login", async (req, res) => {
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
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  //  set token in cookie
  res.cookie("AuthToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 36000000),
  });

  res.status(200).json({ userId: user.id, email: user.email });
});

app.post("/logout", (req, res) => {
  res.clearCookie("AuthToken");
  res.status(200).json({ message: "Logged out successfully!" });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const checkUser = await prisma.user.findFirst({ where: { email } });
  //  if user exists, return error
  if (!!checkUser) {
    return res.status(409).json({ error: "Username already exists" });
  }
  //  create user
  const user = await prisma.user.create({
    data: { password: bcrypt.hashSync(password, 10), email },
  });
  //  create token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  //  add token in cookie
  res.cookie("AuthToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 36000000),
  });
  res.status(200).json({ message: "Registered successfully!" });
});

app.get("/me", checkCookieMiddleware, (req, res) => {
  res.status(200).json({ id: req.user.id, email: req.user.email });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
