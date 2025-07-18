import cron from "node-cron";
import { Election } from "../models/election.model.js";

cron.schedule("* * * * *", async () => {
    const now = new Date()

    await Election.updateMany(
        { startDate: { $lte: now }, status: "Upcoming" },
        { $set: { status: "Ongoing" } }
    );

    await Election.updateMany(
        { endDate: { $lte: now }, status: "Ongoing" },
        { $set: { status: "Ended" } }
    );
})