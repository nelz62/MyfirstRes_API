
import express,   { Request, Response } from "express";
import { UnitUser, User } from "./User.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./User.DataBase";


export const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {

    try {
        const allUsers: UnitUser[]  = await database.findAll();

        if(!allUsers) {
            res.status(StatusCodes.NOT_FOUND).json({msg:"No users found"});
             return;
        }

         res.status(StatusCodes.OK).json(allUsers);
          return;


    } 
    catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
         return;

        }


})

userRouter.post("/users/:id", async (req: Request, res: Response) => {

    try {
        const user: UnitUser = await database.findOne(req.params.id);
     
        if(!user) {
            res.status(StatusCodes.NOT_FOUND).json({error:"User not found"});
             return;
        }

         res.status(StatusCodes.OK).json(user);
          return;


    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
         return;

    }
})

userRouter.post("/register", async (req: Request, res: Response) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({error:"this Email is already in use"});
             return;
        }
         const newUser =  await database.create(req.body);
         res.status(StatusCodes.CREATED).json(newUser);
          return;
    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
         return;

    }


})

userRouter.post("/login", async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        const user = await database.findByEmail(email);

        if (!email || !password) {
            res.status(StatusCodes.NOT_FOUND).json({error:"this Email is already EXITS"});
             return;
        }

        const comparePassword = await database.comparePassword(email, password);

        if (!comparePassword) {
            res.status(StatusCodes.BAD_REQUEST).json({error:"Invalid email or password"});
             return;
        }
        res.status(StatusCodes.OK).json({user});

    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
         return;

    }
})  

userRouter.put("/users/:id", async (req: Request, res: Response) => {

    try {
        const { username, email, password } = req.body;
        const getUser = await database.findOne(req.params.id);

        if (!username || !email || !password) {
            res.status(404).json({error:"please provide all the parameters required"});
             return;
        }

        if (!getUser) {
            res.status(404).json({error:"User not found and id is invalid"});
             return;
        }

        const updatedUser = await database.update(req.params.id, req.body);
        res.status(201).json(updatedUser);
    }catch (error) {
        console.log(error);
        res.status(500).json({error});
         return;

    }

})  

userRouter.delete("/users/:id", async (req: Request, res: Response) => {
    try{

        const id = (req.params.id);

        const user = await database.findOne(id);

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({error:"User  does not exist"});
             return;
        }
        await database.remove(id);
        res.status(StatusCodes.OK).json({msg:"User deleted successfully"});

    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
         return;
    }

});