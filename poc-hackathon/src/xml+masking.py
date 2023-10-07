import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image

class Xml_masking:
    def __init__(self, path_to_directory):
        self.path_to_directory = path_to_directory

    def euc_dist(point1, point2):
        dist = np.linalg.norm(point1 - point2)
        return dist

    def save_image(name, image_arr):
        im = Image.fromarray(image_arr)
        im.save(name)

    def read_xml_and_masking(self, xml_doc):
        tree = ET.parse(xml_doc)
        root = tree.getroot()
        size = root.find('size')
        width = int(size.find('width').text)
        height = int(size.find('height').text)
        depth = int(size.find('depth').text)
        col_mask_empty = np.zeros(shape=(height, width), dtype=np.uint8)
        table_mask_empty = np.zeros(shape=(height, width), dtype=np.uint8)
        objects = tree.findall('object')
        table_xmin = 0
        table_ymin = 0
        table_xmax = 0
        table_ymax = 0
        prev_dist = 0
        dist = 0
        forward_flag = False
        backward_flag = False
        newtable_flag = True
        col_mask_empty = np.zeros(shape=(height, width), dtype=np.uint8)
        table_mask_empty = np.zeros(shape=(height, width), dtype=np.uint8)
        objects = tree.findall('object')
        for index, object in enumerate(objects):
            bndbox = object.find('bndbox')
            xmin = int(bndbox.find('xmin').text)
            xmax = int(bndbox.find('xmax').text)
            ymin = int(bndbox.find('ymin').text)
            ymax = int(bndbox.find('ymax').text)
            
            col_mask_empty[ymin:ymax, xmin:xmax] = 255

            if index == 0:
                prev_xmin = int(bndbox.find('xmin').text)
                prev_ymin = int(bndbox.find('ymin').text)
                prev_xmax = int(bndbox.find('xmax').text)
                prev_ymax = int(bndbox.find('ymax').text)

            else:
                if xmin > prev_xmin and newtable_flag:
                    table_xmin = prev_xmin
                    table_ymin = prev_ymin
                    newtable_flag = False
                    forward_flag = True
                    backward_flag = False
                if xmin < prev_xmin and newtable_flag:
                    table_xmax = prev_xmax
                    table_ymax = prev_ymax
                    newtable_flag = False
                    backward_flag = True
                    forward_flag = False
                if forward_flag:
                    dist = Xml_masking.euc_dist(np.array([xmin, ymin]), np.array([prev_xmax, prev_ymin]))
                    if prev_dist == 0:
                        prev_dist = dist
                    else:
                        if int(np.divide(dist, prev_dist)) > 5:
                            newtable_flag = True
                            table_mask_empty[table_ymin:prev_ymax, table_xmin:prev_xmax] = 255
                            prev_dist = 0 
                        if index==len(objects)-1:
                            newtable_flag = True
                            table_mask_empty[table_ymin:ymax, table_xmin:xmax] = 255
                            prev_dist = 0
                if backward_flag:
                    dist = Xml_masking.euc_dist(np.array([xmax, ymin]), np.array([prev_xmin, prev_ymin]))
                    if prev_dist == 0:
                        prev_dist = dist
                    else:
                        if int(np.divide(dist, prev_dist)) > 5 or index==len(objects)-1:
                            newtable_flag = True
                            table_mask_empty[ymin:table_ymax, xmin:table_xmax] = 255
                            prev_dist = 0
                
                prev_xmin = int(bndbox.find('xmin').text)
                prev_ymin = int(bndbox.find('ymin').text)
                prev_xmax = int(bndbox.find('xmax').text)
                prev_ymax = int(bndbox.find('ymax').text)
                prev_dist = dist

                Xml_masking.save_image("table_mask.jpeg", table_mask_empty)
                Xml_masking.save_image("column_mask.jpeg", col_mask_empty)