import admin from "firebase-admin";
import { Promise } from "mongoose";
import { readFileSync } from "node:fs";
import path from "node:path";

export class NotificationService {
  private client: admin.app.App;

  constructor() {
    const firebasePath = path.join(
      process.cwd(),
      "config",
      "social-app-abdo-firebase-adminsdk-fbsvc-f15432ea3a.json"
    );

    const serviceAccount = JSON.parse(
      readFileSync(firebasePath, "utf8")
    );

    if (!admin.apps.length) {
      this.client = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.client = admin.app();
    }
  }

  async sendNotification({
    token,
    data,
  }: {
    token: string;
    data: { title: string; body: string };
  }) {
    return this.client.messaging().send({
      token,
      data,
    });
  }

  async sendNotifications({
    tokens,
    data,
  }: {
    tokens: string[];
    data: { title: string; body: string };
  }) {
    await Promise.allSettled(
      tokens.map((token) =>
        this.sendNotification({
          token,
          data,
        })
      )
    );
  }
}

export const notify = new NotificationService();