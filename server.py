import os
from flask import Flask, jsonify, render_template, request
from database import add_message, get_data, reset_table


os.chdir(os.path.dirname(__file__))


app = Flask(__name__)


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@app.route("/msgFromServer", methods=["POST"])
def send_msg():  # pylint: disable=missing-function-docstring
    data = request.get_data()
    number = int(data)
    msg = get_data()
    print(msg)
    if number == len(msg):
        return jsonify("no")
    print(msg[number : len(msg)])
    return jsonify(msg[number : len(msg)])


@app.route("/msgFromHtml", methods=["POST"])
def receive_msg():  # pylint: disable=missing-function-docstring
    result = request.get_data()
    msg = result.decode("utf-8")
    print(msg, msg == "/reset")
    if msg == "/reset":
        reset_table()
        return "reset"
    if msg == "/test":
        add_message("bonsoir")
        return "ptdrr"
    add_message(msg)
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
