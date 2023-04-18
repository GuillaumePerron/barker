import os
from flask import Flask, jsonify, render_template, request
from database import add_message, get_data, reset_table, auto_delete


os.chdir(os.path.dirname(__file__))


app = Flask(__name__)


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@app.route("/msgFromServer", methods=["POST"])
def send_msg():  # pylint: disable=missing-function-docstring
    data = request.get_data()
    number = int(data)
    auto_delete()
    msg = get_data()
    print(msg)
    if number == len(msg):
        return jsonify("no")
    return jsonify(msg[number : len(msg)])


@app.route("/msgFromHtml", methods=["POST"])
def receive_msg():  # pylint: disable=missing-function-docstring
    result = request.get_data()
    msg = result.decode("utf-8")
    if "/reset" in msg:
        reset_table()
        return "reset"
    if "/test" in msg:
        add_message("bonsoir")
        return "ptdrr"
    if "/rick" in msg:
        add_message(
            '<img src="https://media.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif">'
        )
        return "rick"
    if "/minecraft" in msg:
        add_message(
            '<iframe src="https://funhtml5games.com?embed=mineblock" style="border:none;" frameborder="0" scrolling="no"></iframe>'
        )
        return
    add_message(msg)
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
