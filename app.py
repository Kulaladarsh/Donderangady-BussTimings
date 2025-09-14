from flask import Flask, render_template, request, redirect, make_response
from db import rating_collection, visitor_collection, collection
from datetime import datetime
import webbrowser
import threading

app = Flask(__name__)

# 🔁 Automatically open browser
def open_browser():
    webbrowser.open("http://127.0.0.1:5000/")

# 👣 Count visitor once per browser using a cookie
@app.route("/", methods=["GET"])
def index():
    visited = request.cookies.get("visited")
    if not visited:
        visitor_collection.insert_one({"timestamp": datetime.now()})
    
    bus_data = list(collection.find({}, {"_id": 0}))
    visitor_count = visitor_collection.count_documents({})
    
    ratings = list(rating_collection.find({}))
    total = sum([r["rating"] for r in ratings])
    count = len(ratings)
    average_rating = round(total / count, 1) if count > 0 else 0

    msg = request.args.get("msg")  # Get message from query

    response = make_response(render_template("index.html",
                                             bus_data=bus_data,
                                             visitor_count=visitor_count,
                                             average_rating=average_rating,
                                             msg=msg))
    if not visited:
        response.set_cookie("visited", "yes", max_age=60*60*24*365)  # 1 year
    return response

# ⭐ Handle rating once per user using cookie
@app.route('/rate', methods=["POST"])
def rate():
    if request.cookies.get("rated"):
        return redirect("/?msg=already_rated")

    rating_value = int(request.form.get("rating"))
    rating_collection.insert_one({"rating": rating_value, "timestamp": datetime.now()})

    response = make_response(redirect("/?msg=thank_you"))
    response.set_cookie("rated", "yes", max_age=60*60*24*365)  # 1 year
    return response

# 🚀 Start server
if __name__ == "__main__":
    threading.Timer(1.0, open_browser).start()
    print("🚍 Visit your app: http://127.0.0.1:5000/")
    app.run(debug=True)
