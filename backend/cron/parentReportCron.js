const cron = require("node-cron");
const ShareConfig = require("../models/shareConfigModel");
const { generateParentReport } = require("../services/parentReportService");
const { generateEmailHTML } = require("../utils/emailTemplate");
const { sendParentEmail } = require("../services/mailService");

cron.schedule("0 0 1 * *", async () => {

  const users = await ShareConfig.find({ isSharingEnabled: true });

  for (const user of users) {
    const report = await generateParentReport(user.userId);

    if (!report) continue;

    const html = generateEmailHTML(report, user.tone);

    await sendParentEmail(user.parentEmail, html);

    user.lastSentAt = new Date();
    await user.save();
  }
});