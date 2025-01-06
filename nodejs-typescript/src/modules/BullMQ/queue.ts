import { Queue } from "bullmq";
import dotenv from "dotenv";

import { randomUUID } from "crypto";
import { ISendMail, sendEmail } from "modules/nodemailer/nodemailer";


dotenv.config();
const RedisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
};

const emailQueue = new Queue("emailQueue", {
  connection: RedisConnection,
});

const emailSending = async (data: ISendMail) => {
  const result = await emailQueue.add("sendEmail", data);
  if(result){
    console.log(`Job sendEmail to ${data.toEmail} added!`);
  }
};


export { emailQueue, emailSending ,RedisConnection };
