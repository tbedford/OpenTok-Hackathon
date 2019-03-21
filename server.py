#!/usr/bin/env python3

import requests
import json

from requests.auth import HTTPBasicAuth
from flask import Flask, request, jsonify, render_template
from pprint import pprint

# OpenTok Server SDK
from opentok import OpenTok
from opentok import MediaModes
from opentok import ArchiveModes

api_key = "API_KEY"
api_secret = "API_SECRET"
opentok = OpenTok(api_key, api_secret)

# create session
session = opentok.create_session(media_mode=MediaModes.routed)
session_id = session.session_id

# generate token
token = opentok.generate_token(session_id)

# archive ID for this session
archive_id = ""

app = Flask(__name__)

@app.route("/session")
def session_get():
    obj = {}
    obj['apiKey'] = api_key
    obj['sessionId'] = session_id
    obj['token'] = token
    j = json.dumps(obj)
    return (j)

@app.route("/monitoring", methods=['POST'])
def monitoring():
    print ("Monitoring:")
    data = request.get_json()
    pprint(data)
    return ("200")

@app.route("/archive/get")
def archive_get():
    archive = opentok.get_archive(archive_id)
    j = json.dumps(archive)
    return (j)

@app.route("/archive/start")
def archive_start():
    global archive_id
    archive = opentok.start_archive(session_id, name=u'Important Presentation')
    archive_id = archive.id
    print ("Started archive: %s" % archive_id)
    j = json.dumps(archive_id)
    return (j)

@app.route("/archive/stop")
def archive_stop():
    opentok.stop_archive(archive_id)    
    print ("Stop archive: %s" % archive_id)
    j = json.dumps(archive_id)
    return (j)

@app.route("/archive/delete")
def archive_delete():
    opentok.delete_archive(archive_id)    
    print ("Delete archive: %s" % archive_id)
    j = json.dumps(archive_id)
    return (j)

@app.route("/archive/list")
def archive_list():
    archive_list = []
    archives = opentok.list_archives() 
    for archive in archives:
        print(archive.id)
        archive_list.append(archive.id)    
    j = json.dumps(archive_list)
    return (j)

@app.route("/broadcast/msg")
def broadcast_msg():
    payload = {'data': "This is a broadcast message from the server!"}
    opentok.signal(session_id, payload)
    j = json.dumps(payload)
    return (j)

if __name__ == '__main__':
    app.run(host="localhost", port=9000)

