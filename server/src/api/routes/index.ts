import { Application, NextFunction, Request, Response, Router } from 'express'
import userRouter from './user.router'
import storeRouter from './records.router'
import UserData from '../../AuthServer/types/UserData'
import { JWT_ACCESS_TOKEN_PRIVATE_KEY } from '../../utils/config'
const jwt = require('jsonwebtoken')
 
export default function routes(app: Application): void {
    app.use('/api/user', authenticateToken,  userRouter)
    app.use('/api/store', authenticateToken,  storeRouter)
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, JWT_ACCESS_TOKEN_PRIVATE_KEY, (err: Error, user: UserData) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.body.userId = user.id
      next()
    })
  }
