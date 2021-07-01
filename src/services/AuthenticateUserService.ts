import { getCustomRepository } from "typeorm";

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { UsersRepositories } from "../repositories/UsersRepositories"



interface IAuthenticateRequest{
  email: string;
  password: string;
}

class AuthenticateUserService{

  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({
      email
    });

    if(!user) {
      throw new Error("Emai/Password incorrect");
    }



    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new Error("Emai/Password incorrect");
    }


    const token = sign({
      email: user.email,
    },
    "7fb391545b7ca20feae5ab0b07a4fc6b", 
    {
      subject : user.id,
      expiresIn: "1d",
    } 
    );

    return token;
  }

}

export {AuthenticateUserService}