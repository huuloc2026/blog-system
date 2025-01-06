// email.process.ts

import { Worker, Job } from "bullmq";
import { emailQueue, RedisConnection } from "./queue"; // Đảm bảo emailQueue đã được khởi tạo
import { sendEmail } from "modules/nodemailer/nodemailer";

// Khởi tạo worker một lần duy nhất


const processTask = async (job: Job) => {
  const payload = job.data;
  try {
    console.log("Worker running...");
    await sendEmail(payload);
    console.log(`Email sent to ${payload.toEmail}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

let emailWorker: Worker | null = null;
if (!emailWorker) {
  emailWorker = new Worker(emailQueue.name, processTask, {
    connection: RedisConnection,
  });
  emailWorker.on("active", (job) => {
    console.log(`Worker started processing job ${job.id}`);
  });

  emailWorker.on("completed", (job: any) => {
    console.log(`Job completed to send email: ${job.data.toEmail}`);
  });

  emailWorker.on("failed", (job: any, err: Error) => {
    console.error(`Job failed to send email: ${job.id}, Error: ${err.message}`);
  });

  emailWorker.on("stalled", (job: any) => {
    console.log(`Job stalled: ${job.id}`);
  });

  emailWorker.on("error", (err) => {
    console.error("Worker encountered an error:", err);
  });
}

export { emailWorker };
