import cv2
import numpy as np
import json

roi_list = []
# Mouse callback function
def draw_rectangle(event, x, y, flags, param):
    global ix, iy, drawing, roi_list
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        cv2.rectangle(image, (ix, iy), (x, y), (0, 255, 0), 2)
        roi = image[min(iy, y):max(iy, y), min(ix, x):max(ix, x)]
        left = ix
        bottom = y
        right = x
        top = iy

        # Create a dictionary for the rectangle coordinates
        rectangle_coords = {
            "top": int(top),
            "left": int(left),
            "bottom": int(bottom),
            "right": int(right)
        }
        roi_list.append(rectangle_coords)
        print(roi_list)

# Load the image
image = cv2.imread('tableproc.png')  # Replace 'your_image_path.jpg' with the path to your image

cv2.namedWindow('Image')
cv2.setMouseCallback('Image', draw_rectangle)

# Automatic ROI extraction based on contours and size
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY) #cv2.THRESH_BINARY_INV
#contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) original
contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

# Sort contours based on their positions
contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])  # Sort by x-coordinate
contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[1])  # Then sort by y-coordinate

i=0;
for contour in contours:
    x, y, w, h = cv2.boundingRect(contour)
    min_width = 12
    max_width = 30
    min_height = 12
    max_height = 30

    if min_width < w < max_width and min_height < h < max_height:
        i = i+1;
        if i>273 and i<298:
            roi = image[y:y+h, x:x+w]
            # roi_list.append(roi)
            # print("x: "+str(x)+" y: "+str(y)+" w: "+str(w)+" h: "+str(h))
            left = x+2
            bottom = (y + h) - 2
            right = (x + w) - 2
            top = y + 2

            # Create a dictionary for the rectangle coordinates
            rectangle_coords = {
                "top": int(top),
                "left": int(left),
                "bottom": int(bottom),
                "right": int(right)
            }
            
            roi_list.append(rectangle_coords)
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 1)
            if(i==297):
                break;

while True:
    cv2.imshow('Image', image)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        # roi_list = sorted(roi_list, key=lambda roi_list:roi_list['right'])
        # roi_list = sorted(roi_list, key=lambda roi_list:roi_list['top'])
        f = open("dump.json", "a")
        f.write(json.dumps(roi_list))
        f.close()
        print(roi_list)
        break
    elif key == ord('c'):  # Clear all drawn rectangles
        image = cv2.imread('tableproc.png')
        roi_list = []

    # Process the extracted ROIs as needed
    # for i, roi in enumerate(roi_list):
    #     cv2.imwrite(f'custom_roi_{i}.jpg', roi)  # Save the ROI as a separate image

cv2.destroyAllWindows()
