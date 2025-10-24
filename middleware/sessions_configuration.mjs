import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({
        clientPromise: mongoose.connect(process.env.MONGO_URI)
    .then(m => m.connection.getClient()),
         collectionName: "sessions",
      }
      ),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 *7, // 1 day
    httpOnly: true, // prevents JS access to cookies (protection)
    secure: process.env.NODE_ENV === "production", // use HTTPS only in prod
  },
});

export { sessionConfig };