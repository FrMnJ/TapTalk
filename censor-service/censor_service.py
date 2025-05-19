from flask_cors import CORS, cross_origin
from flask import Flask, request
from flask import json

from spanlp.palabrota import Palabrota

app = Flask(__name__)
cors = CORS(app)

@app.route('/censor', methods = ['POST'])
@cross_origin()
def censor():
    try:
        body = request.json     
        in_message = body['message']

        if in_message and len(str(in_message).strip()):
            palabrota = Palabrota()
            censored = palabrota.censor(in_message)
            response = {
                "success": True,
                "message": "OK",
                "error_code": 0,
                "data": {
                    'message': in_message,
                    'censored': censored
                }
            }
            return response
        else:
            return {
                "success": False,
                "message": "Bad Request - message is required",
                "error_code": 400,
                "data": {}
            }
    except Exception as e:
        return {
            "success": False,
            "message": "Internal Server Error - "+str(e),
            "error_code": 500,
            "data": {}
        }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)