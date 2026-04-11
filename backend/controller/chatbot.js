const BehaviorSnapshot = require("../models/behaviorSnapshotModel");
const { runChatbot } = require("../services/mlBridge");

exports.handleChatQuery = async (req, res) => {
  try {
    const userId = req.user._id;
    const { question } = req.body;

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const snapshot = await BehaviorSnapshot.findOne({
      user: userId,
      month
    });

    console.log("snapshot mlOutput:", JSON.stringify(snapshot?.mlOutput));

    if (!snapshot || !snapshot.mlOutput) {
      return res.status(400).json({
        success: false,
        message: "No analytics available yet. Open dashboard first."
      });
    }

    const botResponse = await runChatbot(
      snapshot.mlOutput,
      question
    );

    res.json({
      success: true,
      message: botResponse.answer
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};