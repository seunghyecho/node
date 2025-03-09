import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../middlewares";
import {
  renderProfile,
  renderJoin,
  renderMain,
  renderHashtag,
} from "../controllers/page";
import User from "../models/user";

const router = express.Router();

router.use((req, res, next) => {
  const user = req.user as User & { Followers?: User[]; Followings?: User[] };
  res.locals.user = req.user;
  // res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followerCount = user.Followers?.length || 0;
  res.locals.followingCount = user.Followings?.length || 0;
  res.locals.followingIdList = user.Followings?.map((f: any) => f.id) || [];
  next();
});

router.get("/profile", isLoggedIn, renderProfile);

router.get("/join", isNotLoggedIn, renderJoin);

router.get("/", renderMain);

router.get("/hashtag", renderHashtag);

export default router;
