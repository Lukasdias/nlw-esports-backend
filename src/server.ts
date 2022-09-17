import { PrismaClient } from "@prisma/client";
import { convertHourStringToMin } from "./utils/convert-hour-string-to-min";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3333",
  })
);

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      ads: true,
    },
  });
  return res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;
  const body: any = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: convertHourStringToMin(body.hourStart),
      hourEnd: convertHourStringToMin(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return res.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourEnd: true,
      hourStart: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedAds = ads.map((ad) => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(",").sort((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      }),
    };
  });

  res.json(mappedAds);
});

app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;
  const add = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });
  res.json({
    discord: add.discord,
  });
});

app.listen(3333);
