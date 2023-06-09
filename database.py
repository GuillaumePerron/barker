"""_summary_

Returns:
    _type_: _description_
"""
import os

# from threading import Thread
# import time
import urllib.parse
import psycopg

from dotenv import dotenv_values

os.chdir(os.path.dirname(__file__))

if os.path.exists(".env"):
    config = dotenv_values(".env")
else:
    config = {
        "USER": os.environ.get("USER_DB"),
        "PASSWORD": os.environ.get("PASSWORD_DB"),
        "HOST": os.environ.get("HOST_DB"),
        "PORT": os.environ.get("PORT_DB"),
        "DATABASE": os.environ.get("DATABASE_DB"),
    }


FILENAME_DB_SHEMA = "database/database.sql"
options = urllib.parse.quote_plus("--search_path=modern,public")
CONN_PARAMS = f"postgresql://{config['USER']}:{config['PASSWORD']}@{config['HOST']}:{config['PORT']}/{config['DATABASE']}?options={options}"  # pylint: disable=line-too-long


def reset_table():  # pylint: disable=missing-function-docstring
    try:
        with psycopg.connect(  # pylint: disable=not-context-manager
            CONN_PARAMS
        ) as conn:
            with conn.cursor() as cur:
                with open(FILENAME_DB_SHEMA, "r", encoding="utf-8") as file:
                    cur.execute(file.read())
    except:
        pass


def get_data():  # pylint: disable=missing-function-docstring
    try:
        with psycopg.connect(  # pylint: disable=not-context-manager
            CONN_PARAMS
        ) as conn:
            with conn.cursor() as cur:
                # "select id_data,un_text from data where date_creation + (interval '1 minute') >= CURRENT_TIMESTAMP ORDER BY date_creation ASC;"""
                cur.execute(
                    "select id_data,un_text from data ORDER BY date_creation ASC;"
                )
                res = []
                for x in cur.fetchall():
                    res.append(x)
                return res
    except:
        pass


def add_message(msg):  # pylint: disable=missing-function-docstring
    try:
        with psycopg.connect(  # pylint: disable=not-context-manager
            CONN_PARAMS
        ) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO data (un_text) VALUES (%(msg)s);",
                    {
                        "msg": str(msg),
                    },
                )
    except:
        pass


if __name__ == "__main__":
    reset_table()
# else:
#     Thread(target=auto_delete).start()
