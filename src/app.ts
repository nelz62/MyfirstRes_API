



import Express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./User.Router"; 

dotevnv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error("Invalid port number. Please ensure PORT is set to a valid number between 0 and 65535.");
}
const app = Express()

app.use(cors());
app.use(Express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/',userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });






console.log("Hello from TypeScript!");
