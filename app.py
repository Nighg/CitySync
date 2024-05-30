from flask import Flask, render_template, request, jsonify
import os 
from deeplearning import object_detection
from deeplearning import real_time_object_detection

# webserver gateway interface
app = Flask(__name__)

BASE_PATH = os.getcwd()
UPLOAD_PATH = os.path.join(BASE_PATH, 'static/upload/')


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        upload_file = request.files['image_name']
        filename = upload_file.filename
        path_save = os.path.join(UPLOAD_PATH, filename)
        upload_file.save(path_save)
        # object_detection(path_save, filename)
        # real_time_object_detection(path_save,filename)
        # message = "File uploaded successfully!"
       
        
        # Determine file type based on extension
        _, file_extension = os.path.splitext(filename)
        if file_extension.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            # Perform object detection on image
            object_detection(path_save, filename)
            response = {"message": filename} 
            return jsonify(response)
        elif file_extension.lower() in ['.mp4']:
            # Perform real-time object detection on video
            real_time_object_detection(path_save,filename)
            response = {"message": "File processed successfully!"}
            return jsonify(response)
              
        # else:
        #     return jsonify({"message": "Unsupported file type."})
        
        # response = {"message": "File processed successfully!"}
        # return jsonify(response)
        
    return render_template('index.html')

@app.route("/first")
def first_page():
    return render_template('first_page.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=9000,debug=True)