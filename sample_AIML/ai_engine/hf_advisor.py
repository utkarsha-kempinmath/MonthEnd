"""
hf_advisor.py

Hugging Face advisory layer using Google FLAN-T5.
- Instruction-tuned
- Grounded responses
- No database access
- No analytics logic
"""

from transformers import pipeline


# --------------------------------
# LOAD FLAN-T5 MODEL
# --------------------------------
def load_hf_model():
    """
    Loads a Google FLAN-T5 model for instruction-following tasks.

    Recommended options:
    - google/flan-t5-small  (fastest, lowest memory)
    - google/flan-t5-base   (balanced, recommended)
    """
    return pipeline(
        task="text2text-generation",
        model="google/flan-t5-base",
        max_new_tokens=150
    )


# --------------------------------
# BUILD PROMPT (INSTRUCTION STYLE)
# --------------------------------
def build_prompt(context):
    """
    Builds an instruction-style prompt from analytics output.
    """
    anomalies = context.get("anomalies", [])
    allowance = context.get("allowance", {})
    remaining = allowance.get("remaining", 0)

    if not anomalies:
        return (
            "You are a budgeting assistant.\n"
            "The user has no unusual spending patterns.\n"
            "Give one short encouraging message."
        )

    prompt_lines = [
        "You are a helpful budgeting assistant for a college student.",
        "Use ONLY the information given below.",
        "Do NOT invent new facts.",
        "",
        f"Remaining allowance: ₹{remaining}",
        "",
        "Unusual expenses:"
    ]

    for a in anomalies:
        prompt_lines.append(
            f"- Category: {a['category']}, "
            f"Amount: ₹{a['amount']}, "
            f"Usual range: {a['normalRange']}"
        )

    prompt_lines.extend([
        "",
        "Tasks:",
        "1. Explain briefly why these expenses are unusual.",
        "2. Suggest 1–2 practical actions the student can take.",
        "3. Keep the tone supportive and non-judgmental."
    ])

    return "\n".join(prompt_lines)


# --------------------------------
# GENERATE ADVICE
# --------------------------------
def generate_advice(hf_pipeline, analytics_output):
    """
    Generates advice text from analytics output.
    """
    prompt = build_prompt(analytics_output)

    result = hf_pipeline(
        prompt,
        do_sample=False
    )

    return result[0]["generated_text"].strip()


# --------------------------------
# CHATBOT RESPONSE
# --------------------------------
def chat_response(hf_pipeline, analytics_output, user_question):
    """
    Answers a user question using analytics context.
    """
    base_prompt = build_prompt(analytics_output)

    chat_prompt = (
        f"{base_prompt}\n\n"
        f"User question: {user_question}\n"
        "Answer clearly and concisely using only the facts above."
    )

    result = hf_pipeline(
        chat_prompt,
        do_sample=False
    )

    return result[0]["generated_text"].strip(
        temperature=0.7,
        repetition_penalty=1.3
    )