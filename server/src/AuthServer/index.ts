import cors from "cors"
import { Request, Response } from "express"
import User from "../entities/user.entity"
import { AUTH_PORT, JWT_ACCESS_TOKEN_PRIVATE_KEY, JWT_REFRESH_TOKEN_PRIVATE_KEY } from "../utils/config"
import redisClient from "../utils/connectRedis"
import { AppDataSource } from "../utils/data-source"
import validateEnv from "../utils/validateEnv"
import UserData from "./types/UserData"

require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors());

app.post('/token', async (req: Request, res: Response) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  const user = await AppDataSource.getRepository(User).findOneBy({refreshToken})
  if(!user){
    return res.sendStatus(401)
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: Error, user: UserData) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken(user)
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', async (req: Request, res: Response) => {
  // remove refreshtoken token from db
  const id = req.body.id
  const result = await AppDataSource.getRepository(User).update({id}, {refreshToken: undefined})
  if(result.affected){
    res.sendStatus(204)
  }else{
    res.sendStatus(403)
  }
})

app.post('/login', async (req: Request, res: Response) => {
  const {email, password} = req.body

  // Authenticate User
  const user = await AppDataSource.getRepository(User).findOneBy({email, password})
  if(!user){
    return res.sendStatus(401)
  }

  const accessToken = generateAccessToken({id: user.id})
  const refreshToken = jwt.sign({id: user.id}, JWT_REFRESH_TOKEN_PRIVATE_KEY)
//   refreshTokens.push(refreshToken)
  const result = await AppDataSource.getRepository(User).update({id: user.id}, {refreshToken: refreshToken})
  if(result.affected){
    return res.json({ accessToken: accessToken, refreshToken: refreshToken, user })
  }
  return res.sendStatus(401).json({message: 'failed to save refresh token'})
})

function generateAccessToken(user: UserData) {
  return jwt.sign(user, JWT_ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '15m' })
}


AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    // UNHANDLED ROUTE

    // GLOBAL ERROR HANDLER

    app.listen(AUTH_PORT, () => {
      console.log(`Server started on port: ${AUTH_PORT}`);
    })

    
  })
  .catch((error: any) => console.log(error));