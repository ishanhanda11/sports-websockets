import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node"

const arcjetKey = process.env.ARCJET_KEY
const arcjetMode = process.env.ARCJET_MODE === 'DRY-RUN' ? 'DRYRUN' : 'LIVE'

if(!arcjetKey) throw new Error('ARCJET environment variable is missing')

export const httpArcjet = arcjet({
    key: arcjetKey,
    rules: [
        shield({mode: arcjetMode}),
        detectBot({mode: arcjetMode, allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]}),
        slidingWindow({mode: arcjetMode, interval:'10s', max:50})
    ]
});

export const wsArcjet = arcjet({
    key: arcjetKey,
    rules: [
        shield({mode: arcjetMode}),
        detectBot({mode: arcjetMode, allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]}),
        slidingWindow({mode: arcjetMode, interval:'2s', max:5})
    ]
});

export function securityMiddleware (){
    return async (req,res,next)=>{
        if(!httpArcjet) return next();
        try{
            const decision = await httpArcjet.protect(req);
            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    return res.status(429).json({error : 'too many requests'})
                }
            return res.status(403).json({error : 'forbidden'})
            }
        }catch(e){
            console.error('Arcjet middleware error',e)
            return res.status(503).json({errro:"service unavailable"})
        }
        next()
    }
}
