"""
run.py

Thin orchestration layer for the AI engine.

This file:
- contains NO I/O
- contains NO execution on import
- contains NO database access
- contains NO CLI behavior

Backend is expected to call the exposed functions directly.
"""

from ai_engine.schemas import validate_payload
from ai_engine.core import run_core_analysis
from ai_engine.hf_advisor import load_hf_model, generate_advice, chat_response


# --------------------------------
# ANALYTICS ENTRY POINT
# --------------------------------
def run_analytics(payload: dict) -> dict:
    """
    Runs core analytics only (no Hugging Face).

    Intended usage:
    - once per session
    - cached by backend
    """
    validate_payload(payload)
    return run_core_analysis(payload)


# --------------------------------
# ADVISORY ENTRY POINT
# --------------------------------
def run_advisory(analytics_output: dict) -> dict:
    """
    Generates natural-language advice from analytics output.

    Intended usage:
    - on-demand
    - chatbot / explanation layer
    """
    hf_pipeline = load_hf_model()
    advice = generate_advice(hf_pipeline, analytics_output)

    return {
        "advice": advice
    }


# --------------------------------
# CHATBOT ENTRY POINT
# --------------------------------
def run_chatbot(
    analytics_output: dict,
    user_question: str
) -> dict:
    """
    Answers a user question using cached analytics.
    """
    hf_pipeline = load_hf_model()
    answer = chat_response(
        hf_pipeline,
        analytics_output,
        user_question
    )

    return {
        "answer": answer
    }
