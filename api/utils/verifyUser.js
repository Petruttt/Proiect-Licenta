import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';    


export const verifyToken = (req,res,next) => {
    const token = req.cookies.acces_token;
    if(!token){
        return next(errorHandler('You are not authorized to access this route',401));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler('You are not authorized to access this route',401));
        }
        req.user = user;
        next();
    });

}