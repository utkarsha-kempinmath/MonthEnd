import fetch from "node-fetch";

export const analyzeText = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: "No input provided" });
    }

    // Create prompt (simple English)
    const prompt = `
You are a helpful assistant.

User input:
"${userInput}"

Task:
Analyze the situation and give clear advice.
    `;

    // Call Hugging Face FLAN-T5
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const data = await response.json();

    // Extract AI output
    const aiResponse = data[0]?.generated_text;

    // Send back to frontend
    res.json({
      success: true,
      result: aiResponse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
};
