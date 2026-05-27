import { Router } from "express";
import { createCommentarySchema } from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { prisma } from "../db/db.js";

const commentaryRouter = Router({ mergeParams: true});

commentaryRouter.post("/", async (req, res) => {
  
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "invalid params", details: paramsParsed.error.issues });
  }

  const bodyParsed = createCommentarySchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "invalid payload", details: bodyParsed.error.issues });
  }

  try {
    const commentary = await prisma.commentary.create({
      data: {
        matchId: paramsParsed.data.id,
        ...bodyParsed.data,
      },
    });
     res.app.locals.matchBroadcast?.(paramsParsed.data.id, {
     type: "commentary_created",
     data: commentary,
    });
    return res.status(201).json({ message: "commentary created successfully", data: commentary });
  } catch (error) {
    console.error("Failed to create commentary:", error);
    return res.status(500).json({ error: "Failed to create commentary" });
  }
});

export default commentaryRouter;
