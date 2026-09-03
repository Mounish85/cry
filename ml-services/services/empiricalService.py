from models.empiricalModel import empirical_model


def analyze_action_item(action_item):
    """
    Analyze a single CRY project action item.
    """

    days_remaining = action_item.get("daysRemaining")
    status = action_item.get("status")

    if days_remaining is None or status is None:
        raise ValueError(
            "daysRemaining and status are required"
        )

    result = empirical_model(
        days_remaining,
        status
    )

    return {
        "actionItemId": action_item.get("actionItemId"),
        "attentionScore": result["attentionScore"],
        "attentionLevel": result["attentionLevel"]
    }