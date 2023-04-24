import os
from time import sleep
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from database import add_message, get_data, reset_table, auto_delete


os.chdir(os.path.dirname(__file__))


app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():  # pylint: disable=missing-function-docstring
    return render_template("index.html")


@socketio.on("join", namespace="/chat")
def send_msg(_):  # pylint: disable=missing-function-docstring
    current_msg = get_data()
    emit("init", current_msg)
    while True:
        auto_delete()
        msg = get_data()
        if msg != current_msg:
            array_to_del = list(set(current_msg) - set(msg))
            if len(array_to_del) != 0:
                for key in array_to_del:
                    emit("msgToDel", key[0])
            current_msg = msg

        sleep(1)


@socketio.on("addMsg", namespace="/chat")
def receive_msg(msg):  # pylint: disable=missing-function-docstring
    user = msg.split(":")[0]
    if "/reset" in msg:
        reset_table()
        return "reset"
    if "/rick" in msg:
        msg = f'{user}:<img src="https://media.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif">'

    add_message(msg)
    emit("message", get_data())
    return "ok"


if __name__ == "__main__":
    socketio.run(app=app, host="0.0.0.0", port=80)
