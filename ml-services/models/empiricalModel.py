def calculate_attention_score(days_remaining, status):
    """
    Calculate an empirical attention score for an action item.

    Higher score = action item needs more attention.
    """

    score = 0

    if status == "OVERDUE":
        score += 100

    elif status == "PENDING":
        if days_remaining <= 0:
            score += 100
        elif days_remaining <= 7:
            score += 80
        elif days_remaining <= 14:
            score += 50
        else:
            score += 20

    elif status == "COMPLETED":
        score = 0

    return score


def classify_attention(score):
    """
    Convert score into an attention level.
    """

    if score >= 80:
        return "HIGH"

    elif score >= 50:
        return "MEDIUM"

    return "LOW"


def empirical_model(days_remaining, status):
    score = calculate_attention_score(
        days_remaining,
        status
    )

    attention = classify_attention(score)

    return {
        "attentionScore": score,
        "attentionLevel": attention
    }