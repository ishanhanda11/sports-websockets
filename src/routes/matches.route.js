import express from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import {prisma} from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { env } from "prisma/config";
const matchRouter = express.Router()

const MAX_LIMIT = 100
matchRouter.get('/', async (req,res)=>{
    const parsed = listMatchesQuerySchema.safeParse(req.query)
    if(!parsed.success){
        return res.status(400).json({error:"invalid payload", details: JSON.stringify(parsed.error)})
    }
    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT)
    try{
        const result = await prisma.match.findMany({
        orderBy: {
        createdAt: "desc"
    },
  take: limit
});
        res.status(201).json({message:"match fetched successfully", data: result})
    }catch(e){

        return res.status(500).json({error: "Failed to fetch matches", details: JSON.stringify(e)})
    }
    }
)


matchRouter.post('/create',async(req,res)=>{
    const parsed = createMatchSchema.safeParse(req.body)
    const {data:{startTime, endTime, homeScore, awayScore}} = parsed
    

    if(!parsed.success){
        return res.status(400).json({error:"invalid payload", details: JSON.stringify(parsed.error)})
    }
    try{
        const event = await prisma.match.create({data:{
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status : getMatchStatus(startTime,endTime)


        }})
        res.status(201).json({message:"match created successfully", data: event})
    }catch(e){
        return res.status(500).json({error: "Failed to create Match", details: JSON.stringify(e)})
    }
})
export default matchRouter