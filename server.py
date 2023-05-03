import os
from flask import Flask, jsonify, render_template, request
from database import add_message, get_data, reset_table
import json


os.chdir(os.path.dirname(__file__))


app = Flask(__name__)


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@app.route("/msgFromServer", methods=["POST"])
def send_msg():  # pylint: disable=missing-function-docstring
    result = json.loads(request.get_data())
    hashtag = result["hashtag"]
    main_page = result["mainPage"]
    msg = get_data(main_page, "#" + hashtag)
    return jsonify(msg)


@app.route("/msgFromHtml", methods=["POST"])
def receive_msg():  # pylint: disable=missing-function-docstring
    result = request.get_data()
    msg = result.decode("utf-8")
    user = msg.split(":")[0]
    if "/reset" in msg:
        reset_table()
        return "reset"
    if "/rick" in msg:
        add_message(
            f'{user}:<img src="https://media.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif">'
        )
        return "rick"
    add_message(msg)
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
