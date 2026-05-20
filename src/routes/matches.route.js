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
        return res.status(400).json({error:"invalid query", details: parsed.error.issues})
    }
    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT)
    try{
        const result = await prisma.match.findMany({
        orderBy: {
        createdAt: "desc"
    },
  take: limit
});
        res.status(200).json({message:"match fetched successfully", data: result})
    }catch(e){
        console.error("Failed to fetch matches:", e)
        return res.status(500).json({error: "Failed to fetch matches"})
        
    }
    }
)


matchRouter.post('/create',async(req,res)=>{
    const parsed = createMatchSchema.safeParse(req.body)
    
    if(!parsed.success){
        return res.status(400).json({error:"invalid payload", details: parsed.error.issues})
    }
    const { startTime, endTime, homeScore, awayScore } = parsed.data
    try{
        const event = await prisma.match.create({data:{
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status : getMatchStatus(startTime,endTime)


        }})
          
       if (res.app.locals.broadCastMatchCreated) {
           try {
               res.app.locals.broadCastMatchCreated(event)
           } catch (broadcastError) {
               console.error("Failed to broadcast match_created:", broadcastError)
           }
       }
        res.status(201).json({message:"match created successfully", data: event})
    }catch(e){
        console.error("Failed to create match:", e)
        return res.status(500).json({error: "Failed to create match"})
        
}})
export default matchRouter