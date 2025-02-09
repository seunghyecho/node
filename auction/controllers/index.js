const { Op } = require("sequelize");
const schedule = require("node-schedule");
const { Good, Auction, User, sequelize } = require("../models");

exports.renderMain = async (req, res, next) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
    const goods = await Good.findAll({
      where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
      // WHERE SoldId IS NULL AND createdAt >= "2025-12-24"
    });
    res.render("main", {
      title: "NodeAuction",
      goods,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderJoin = (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeAuction",
  });
};

exports.renderGood = (req, res) => {
  res.render("good", { title: "상품 등록 - NodeAuction" });
};

exports.createGood = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const good = await Good.create({
      OwnerId: req.user.id,
      name,
      img: req.file.filename,
      price,
    });

    const end = new Date();
    end.setDate(end.getDate() + 1); // 하루 뒤
    const job = schedule.scheduleJob(end, async () => {
      const success = await Auction.findOne({
        where: { GoodId: good.id },
        order: [["bid", "DESC"]],
      });
      await good.setSold(success.UserId);
      await User.update(
        {
          money: sequelize.literal(`money - ${success.bid}`),
          // SET money = money - 1000000
        },
        {
          where: { id: success.UserId },
        }
      );
    });
    job.on("error", console.error);
    job.on("success", () => {
      console.log(`${good.id} 스케줄링 성공`);
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderAuction = async (req, res, next) => {
  try {
    // 1. good, auction 각각 호출
    // const good = await Good.findOne({
    //   where: { id: req.params.id },
    //   include: {
    //     model: User,
    //     as: "Owner",
    //   },
    // });
    // const auction = await Auction.findAll({
    //   where: { GoodId: req.params.id },
    //   include: { model: User },
    //   order: [["bid", "ASC"]],
    // });

    // 2. good, auction 한번에 호출
    const [good, auction] = await Promise.all([
      Good.findOne({
        where: { id: req.params.id },
        include: {
          model: User,
          as: "Owner",
        },
      }),
      Auction.findAll({
        where: { GoodId: req.params.id },
        include: { model: User },
        order: [["bid", "ASC"]],
      }),
    ]);
    res.render("auction", {
      title: `${good.name} - NodeAuction`,
      good,
      auction,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.bid = async (req, res, next) => {
  try {
    const { bid, msg } = req.body;
    const good = await Good.findOne({
      where: { id: req.params.id },
      include: { model: Auction },
      order: [[{ model: Auction }, "bid", "DESC"]], // include 된 애의 정렬
    });

    if (!good) {
      return res.status(404).send("해당 상품은 존재하지 않습니다");
    }
    if (good.price >= bid) {
      return res.status(403).send("시장 가격보다 높게 입찰해야 합니다");
    }
    if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date()) {
      return res.status(403).send("경매가 이미 종료되었습니다");
    }
    if (good.Auction?.[0]?.bid >= bid) {
      // 0번째가 이전 가장 높은 입찰가, DESC 내림차순 했기 때문에 기준 입찰가 0 번째로 설정
      return res.status(403).send("이전 입찰가보다 높아야 합니다");
    }
    const result = await Auction.create({
      bid,
      msg,
      UserId: req.user.id,
      GoodId: req.params.id,
    });
    req.app.get("io").to(req.params.id).emit("bid", {
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderList = async (req, res, next) => {
  try {
    const goods = await Good.findAll({
      where: { SoldId: req.user.id },
      include: { model: Auction },
      order: [[{ model: Auction }, "bid", "DESC"]], // 낙찰가 보여주기 위한 목적
    });
    res.render("list", { title: "낙찰 목록 - NodeAuction", goods });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
