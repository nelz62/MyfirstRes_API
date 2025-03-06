import { User, UnitUser, Users } from "./User.interface";
import bcryptjs from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";

let users: Users = loadUsers();

function loadUsers(): Users {
  try {
    const data = fs.readFileSync("users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error loading users, ${error}`);
    return {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
    console.log("Users saved successfully");
  } catch (error) {
    console.log(`Error:${error}`);
  }
}

export const findAll = async (): Promise<UnitUser[]> => Object.values(users); 

export const findOne = async (id:string): Promise<UnitUser> => users[id];

export const create = async (usersData: UnitUser): Promise<UnitUser | null> => {


  let id = random();
  let check_users = await findOne(id);  
  while (check_users) {
    id = random();
    check_users = await findOne(id);
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(usersData.password, salt);

  const user: UnitUser = {
    id: id,
    username: usersData.username,
    email: usersData.email,
    password: hashedPassword,
  };
  users[id] = user;
  saveUsers();
  return user;
};

export const findByEmail = async (user_email: string): Promise<null | UnitUser> => {

const allUsers = await findAll();
 const getUser = allUsers.find((result) => result.email === user_email);

  return getUser || null;
};
  

 export const comparePassword = async (user_email: string, supplied_password: string): Promise<null | UnitUser> => {

    const user = await findByEmail(user_email);
    
  const decryptedPassword = await bcryptjs.compare(supplied_password, user!.password);
  if (!decryptedPassword) {
    return null;
    }
    return user;
}

export const update = async (
  id: string,
  updateValues: User
): Promise<UnitUser | null> => {
  const userExists = await findOne(id);

  if (!userExists) {
    return null;
  }

  if (updateValues.password) {
    const salt = await bcryptjs.genSalt(10);
    const newPassword = await bcryptjs.hash(updateValues.password, salt);

    updateValues.password = newPassword;
  }

  users[id] = {
    ...userExists,
    ...updateValues,
  };

  saveUsers();
  return users[id];
};

export const remove = async (id: string): Promise<null | void> => {
  const user = await findOne(id);

  if (!user) {
    return null;
  }

  delete users[id];
  saveUsers();
};
