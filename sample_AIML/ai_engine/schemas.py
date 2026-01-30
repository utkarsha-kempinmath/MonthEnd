"""
schemas.py

Defines input and output data contracts for the AI engine.

These schemas are:
- Backend-facing (what backend must send)
- HuggingFace-facing (what LLM can see)
- Lightweight (no external dependencies)
"""

# --------------------------------
# EXPECTED INPUT SCHEMA
# --------------------------------

REQUIRED_EXPENSE_FIELDS = {
    "date",
    "category",
    "amount",
}

REQUIRED_USER_FIELDS = {
    "userId",
    "monthlyAllowance",
}


def validate_payload(payload):
    """
    Validates the payload sent by the backend.

    Expected format:
    {
        "user": {
            "userId": str,
            "monthlyAllowance": number
        },
        "expenses": [
            {
                "date": str,
                "category": str,
                "amount": number
            }
        ]
    }
    """
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a dictionary")

    if "user" not in payload or "expenses" not in payload:
        raise ValueError("Payload must contain 'user' and 'expenses'")

    user = payload["user"]
    expenses = payload["expenses"]

    if not isinstance(user, dict):
        raise ValueError("'user' must be an object")

    if not REQUIRED_USER_FIELDS.issubset(user.keys()):
        raise ValueError(
            f"'user' must contain fields: {REQUIRED_USER_FIELDS}"
        )

    if not isinstance(expenses, list):
        raise ValueError("'expenses' must be a list")

    for i, expense in enumerate(expenses):
        if not isinstance(expense, dict):
            raise ValueError(f"Expense at index {i} is not an object")

        if not REQUIRED_EXPENSE_FIELDS.issubset(expense.keys()):
            raise ValueError(
                f"Expense at index {i} must contain fields: {REQUIRED_EXPENSE_FIELDS}"
            )


# --------------------------------
# OUTPUT SCHEMA (CORE ANALYTICS)
# --------------------------------

CORE_OUTPUT_SCHEMA = {
    "status": "ok | not_enough_data",
    "anomalies": [
        {
            "date": "str",
            "category": "str",
            "amount": "number",
            "normalRange": "str"
        }
    ],
    "summary": {
        "category": "total_spent"
    },
    "allowance": {
        "monthlyAllowance": "number",
        "totalSpent": "number",
        "remaining": "number"
    }
}


# --------------------------------
# HF INPUT SCHEMA (LLM-SAFE VIEW)
# --------------------------------

HF_ANOMALY_VIEW = {
    "category": "str",
    "amount": "number",
    "normalRange": "str"
}

HF_CONTEXT_SCHEMA = {
    "userProfile": {
        "role": "student",
        "budgetCycle": "monthly"
    },
    "anomalies": [HF_ANOMALY_VIEW],
    "summary": {
        "category": "total_spent"
    },
    "allowance": {
        "remaining": "number"
    }
}
