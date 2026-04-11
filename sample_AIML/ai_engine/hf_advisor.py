"""
hf_advisor.py

Hugging Face advisory + chatbot layer
Using Hugging Face Inference API (NO local model download)

Model:
- google/flan-t5-small (free-tier accessible, instruction-tuned)

Requirements:
- huggingface_hub
- HF_API_TOKEN in .env
"""

import os
from pathlib import Path
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
from typer import prompt

# Load environment variables from project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)
#print(f"[DEBUG] Loading .env from: {env_path}")

def safe_generate(hf_client, prompt, **kwargs) -> str:
    """
    Safely consume HF text generation output, with detailed debug logging.
    Prevents StopIteration crashes.
    """
    #print("[DEBUG] HF prompt:\n", prompt[:100] + "...")
    #print("[DEBUG] HF kwargs:\n", kwargs)

    try:
        print("[DEBUG] Calling HF text_generation...")
        result = hf_client.text_generation(prompt, **kwargs)
        #print("[DEBUG] HF call returned, type:", type(result))
        #print("[DEBUG] HF raw result:", repr(result)[:200])

        # If streaming / generator
        if hasattr(result, "__iter__") and not isinstance(result, str):
            #print("[DEBUG] Result is iterable, attempting to consume...")
            chunks = list(result)
            #print("[DEBUG] HF chunked output count:", len(chunks))
            if not chunks:
                #print("[DEBUG] No chunks received")
                return "I'm unable to generate a response right now."
            out = "".join(chunks).strip()
            #print("[DEBUG] HF joined output:", repr(out)[:150])
            return out if out else "I'm unable to generate a response right now."

        # Normal string response
        out = (result or "").strip()
        #print("[DEBUG] HF string output:", repr(out)[:150])
        if not out:
            #print("[DEBUG] Empty string response from HF")
            return "I'm unable to generate a response right now."

        return out

    except StopIteration:
        #print("[DEBUG] StopIteration exception")
        return "I'm unable to generate a response right now."
    except Exception as e:
        #print("[DEBUG] HF exception caught:", type(e).__name__, "-", str(e)[:200])
        return f"Model error: {type(e).__name__}: {str(e)[:100]}"


def safe_generate_with_retries(hf_client, prompt, retries=3, backoff=2, **kwargs) -> str:
    """Try generation multiple times with exponential backoff when model returns empty or error."""
    for attempt in range(1, retries + 1):
        result = safe_generate(hf_client, prompt, **kwargs)

        if not result.startswith("Model error") and result != "I'm unable to generate a response right now.":
            return result

        if attempt < retries:
            wait = backoff**attempt
            #print(f"[DEBUG] retry {attempt} failed, waiting {wait}s...")
            import time
            time.sleep(wait)

    # Final fallback
    if result.startswith("Model error"):
        return "Advisory unavailable at the moment. Please try again later."

    return "I'm unable to generate a response right now."


# --------------------------------
# INIT HF CLIENT (HOSTED)
# --------------------------------

def load_hf_client():
    token = os.getenv("HF_API_TOKEN")
    if not token:
        raise RuntimeError("HF_API_TOKEN not set. Check .env file exists and is loaded.")

    model_name = os.getenv("HF_MODEL", "tiiuae/falcon-7b-instruct")
    
    token_preview = token[:20] + "..." if len(token) > 20 else token
    #print(f"[DEBUG] Using HF token: {token_preview}")
    #print(f"[DEBUG] Using HF model: {model_name}")

    return InferenceClient(
        model=model_name,
        token=token,
        timeout=30,
        #retries=1,
        #base_url="https://router.huggingface.co"
    )


# --------------------------------
# BUILD INSTRUCTION PROMPT
# --------------------------------
def build_prompt(context):
    anomalies = context.get("anomalies", [])
    allowance = context.get("allowance", {})
    remaining = allowance.get("remaining", 0)
    summary = context.get("summary", {})

    if not anomalies:
        return "Give brief budget advice for someone with no unusual spending."

    # Compact format for flan-t5-small
    spent = sum(summary.values())
    ratio = "overspending" if spent > allowance.get("monthlyAllowance", 1) else "within budget"
    
    anom_list = ", ".join([f"{a['category']}: ₹{a['amount']}" for a in anomalies[:3]])
    
    return (
        f"Budget analysis: Remaining ₹{remaining}. "
        f"Status: {ratio}. "
        f"Unusual expenses: {anom_list}. "
        f"Suggest 1-2 practical budget tips."
    )


# --------------------------------
# RULE-BASED ADVISOR (NO LLM NEEDED)
# --------------------------------

def generate_advice(analytics_output):
    """
    Generate budget advice based on analytics WITHOUT LLM.
    Works with both analytics (core) and fromML (enriched) output.
    Uses v2 metrics for nuanced recommendations.
    """
    # Handle both schemas
    if "financialPosition" in analytics_output:
        # fromML schema (enriched output) - USE RICH METRICS
        financial = analytics_output.get("financialPosition", {})
        total_spent = financial.get("spent", 0)
        monthly = financial.get("budget", 1)
        remaining = financial.get("remaining", 0)
        
        # Extract v2 metrics for context
        risk = analytics_output.get("risk", {})
        risk_level = risk.get("level", "unknown")
        overspending_prob = risk.get("overspendingProbability", 0)
        
        behavioral = analytics_output.get("behavioral", {})
        pattern = behavioral.get("dominantPattern", "unknown")
        stress_ratio = behavioral.get("emotionalMetrics", {}).get("stressSpendRatio", 0)
        
        goal_status = analytics_output.get("goalStatus", {})
        goal_progress = goal_status.get("progress", 0)
        goal_count = goal_status.get("goalCount", 0)
        on_track = goal_status.get("onTrack", True)
        
        anomalies = analytics_output.get("anomalies", [])
        summary = {}
    else:
        # Core analytics schema
        anomalies = analytics_output.get("anomalies", [])
        allowance = analytics_output.get("allowance", {})
        summary = analytics_output.get("summary", {})
        
        remaining = allowance.get("remaining", 0)
        total_spent = allowance.get("totalSpent", 0)
        monthly = allowance.get("monthlyAllowance", 1)
        
        # Defaults for core schema (no v2 metrics)
        risk_level = None
        overspending_prob = 0
        pattern = None
        stress_ratio = 0
        goal_progress = 0
        goal_count = 0
        on_track = True
    
    spent_ratio = total_spent / float(monthly) if monthly > 0 else 0
    
    advice_lines = []
    
    # STATUS LINE - Use v2 metrics if available, fallback to percentage
    if risk_level:
        # Use rich v2 metrics
        if risk_level == "critical":
            advice_lines.append("CRITICAL ALERT: High-risk spending pattern detected. Immediate action required:")
        elif risk_level == "high":
            advice_lines.append("WARNING: Your spending and behavior indicate high risk.")
        elif risk_level == "moderate":
            advice_lines.append(f"CAUTION: Moderate risk detected. You've spent {int(spent_ratio*100)}% of budget.")
            if not on_track:
                advice_lines.append("Your goals are falling behind.")
            if "impulse" in pattern.lower():
                advice_lines.append("Impulse spending detected - slow down before purchases.")
            if stress_ratio > 0.6:
                advice_lines.append(f"Warning: {int(stress_ratio*100)}% of spending is stress-driven.")
        else:  # low risk
            advice_lines.append(f"Good: You've spent {int(spent_ratio*100)}% of budget. Keep tracking.")
    else:
        # Simple percentage-based fallback (core schema)
        if spent_ratio > 0.9:
            advice_lines.append("WARNING: You're spending 90%+ of your budget. Cut unnecessary expenses immediately.")
        elif spent_ratio > 0.7:
            advice_lines.append("CAUTION: You're spending 70%+ of monthly allowance. Be more careful with purchases.")
        else:
            advice_lines.append(f"Good: You've spent {int(spent_ratio*100)}% of budget. Keep tracking.")
    
    # ANOMALY-BASED ADVICE
    if anomalies:
        top_anomaly_cat = max(anomalies, key=lambda x: x.get("amount", 0))["category"]
        advice_lines.append(f"Focus: Your {top_anomaly_cat} spending is abnormally high. Set a weekly limit.")
    
    # CATEGORY DISTRIBUTION TIP
    if summary:
        highest_cat = max(summary.items(), key=lambda x: x[1])[0]
        highest_amt = summary[highest_cat]
        if highest_amt > monthly * 0.3:
            advice_lines.append(f"{highest_cat} is {int(highest_amt/monthly*100)}% of budget. Plan better for this category.")
    
    # GOAL-SPECIFIC ADVICE
    if goal_count > 1 and not on_track:
        advice_lines.append(f"With {goal_count} goals, you need stricter spending discipline. Current progress: {int(goal_progress*100)}%.")
    elif goal_count > 0 and goal_progress < 0.3:
        advice_lines.append(f"Goal achievement at only {int(goal_progress*100)}%. Increase savings or extend timeline.")
    
    # GENERIC TIPS
    advice_lines.append("Tip: Track daily spending. Review budget weekly. Avoid impulse buys.")
    
    return " ".join(advice_lines)


def chat_respond(analytics_output, user_question):
    """
    Answer budget questions based on analytics data.
    Rule-based, no LLM needed.
    Works with both v2 (fromML) and core (analytics) schemas.
    """
    question = user_question.lower()
    
    # Handle both schemas
    if "financialPosition" in analytics_output:
        # fromML v2 schema
        financial = analytics_output.get("financialPosition", {})
        remaining = financial.get("remaining", 0)
        total_spent = financial.get("spent", 0)
        monthly = financial.get("budget", 0)
    else:
        # Core analytics schema
        allowance = analytics_output.get("allowance", {})
        remaining = allowance.get("remaining", 0)
        total_spent = allowance.get("totalSpent", 0)
        monthly = allowance.get("monthlyAllowance", 0)
    
    summary = analytics_output.get("summary", {})
    anomalies = analytics_output.get("anomalies", [])
    
    # DEBUG
    #print(f"[DEBUG] Chat data: remaining={remaining}, spent={total_spent}, monthly={monthly}, anomalies={len(anomalies)}")
    
    # Question matching
    if any(word in question for word in ["afford", "buy", "purchase", "cost", "spare", "spend"]):
        # Extract amount if mentioned
        import re
        amounts = re.findall(r'\d+', user_question)
        if amounts:
            asked_amount = float(amounts[-1])
            if asked_amount <= remaining:
                return f"Yes, you can afford it. You have ₹{remaining:.0f} remaining. But be careful not to overspend."
            else:
                shortfall = asked_amount - remaining
                return f"No. You need ₹{shortfall:.0f} more. Current balance: ₹{remaining:.0f}."
        else:
            return f"You have ₹{remaining:.0f} remaining. Check if it's within that."
    
    elif any(word in question for word in ["spent", "spending", "balance", "money", "left"]):
        return f"Spent: ₹{total_spent:.0f}. Remaining: ₹{remaining:.0f}. Monthly allowance: ₹{monthly:.0f}."
    
    elif any(word in question for word in ["anomal", "unusual", "spike", "high", "expensive"]):
        if anomalies:
            top = anomalies[0]
            return f"Unusual spending detected: {top['category']} ₹{top['amount']:.0f} (normal: {top['normalRange']}). Avoid this."
        else:
            return "No unusual spending patterns detected. You're spending normally."
    
    elif any(word in question for word in ["category", "categories", "expense", "category"]):
        if summary:
            items = ", ".join([f"{k}: ₹{v:.0f}" for k, v in list(summary.items())[:3]])
            return f"Top expenses: {items}"
        return "No spending data available."
    
    elif any(word in question for word in ["save", "tip", "advice", "help", "need to do", "should i"]):
        # Provide savings advice based on current position
        monthly_remaining = monthly - total_spent
        shortfall = 5000 - remaining if 5000 > remaining else 0
        
        if remaining < 2000:
            return f"Your balance is low (₹{remaining:.0f}). Cut non-essential spending next month. Aim to save ₹{int(monthly * 0.2)} for goals."
        elif shortfall > 0:
            monthly_target = shortfall / 4  # Over 4 weeks
            return f"For a ₹5000 trip, you need ₹{shortfall:.0f} more. Save ₹{monthly_target:.0f}/week by reducing discretionary spending."
        else:
            return f"You have enough (₹{remaining:.0f}). After the trip, rebuild buffer to 30% of budget (₹{int(monthly*0.3):.0f})."
    
    elif any(word in question for word in ["thanks", "thank you", "thankyou", "thanks!", "thank u"]):
        return "You're welcome! Feel free to ask anytime about your budget. Good luck with your planning!"
    
    elif any(word in question for word in ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]):
        return f"Hi there! I'm your budget assistant. You have ₹{remaining:.0f} remaining this month. What would you like to know?"
    
    elif any(word in question for word in ["bye", "goodbye", "see you", "exit", "quit"]):
        return "Goodbye! Remember to track your spending. See you next time!"
    
    else:
        # Default helpful response
        return f"Budget: ₹{remaining:.0f} remaining out of ₹{monthly:.0f}. " \
               f"Ask me about spending, balance, unusual expenses, affordability, or saving tips."
