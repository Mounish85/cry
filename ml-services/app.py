import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from services.empiricalService import analyze_action_item

load_dotenv()

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CRY ML Service is running"
    })


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        action_item = request.get_json()

        result = analyze_action_item(action_item)

        return jsonify(result), 200

    except Exception as error:
        return jsonify({
            "message": str(error)
        }), 400


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )