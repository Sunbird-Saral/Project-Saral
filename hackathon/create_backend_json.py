import uuid
import json
# import http.client
import requests

class Generate_backend_roi:
    # def __init__(self, filename):
    #     self.filename=filename
    
    def get_annotation(self, filename):
        with open(filename) as f:
            data = json.load(f)
            f.close()
            return data['regions']
    # , formatAnnotationLookup
    def get_rois(self, regions, i):
        rois = []
        index = 0
        roiIndex = 1
        for region in regions:
            # if val == 'FTE':
            #     if region['tags'][0]==(key):
            #     # try:
            #     #     # annotationTagsValue = formatAnnotationLookup[region['tags'][0]]
            #     # except KeyError as ke:
            #     #     annotationTagsValue =  region['tags'][0]
            #         rois.append({
            #             "annotationTags": str(key),
            #             "extractionMethod": str(val),
            #             "roiId": str(roiIndex),
            #             "index": index,
            #             "rect": {
            #                 # "top": top,
            #                 # "left": left,
            #                 # "bottom": bottom,
            #                 # "right": right
            #                 "top": int(region['boundingBox']['top']),
            #                 "left": int(region['boundingBox']['left']),
            #                 "bottom": int(region['boundingBox']['top']) + int(region['boundingBox']['height']),
            #                 "right": int(region['boundingBox']['left']) + int(region['boundingBox']['width'])
            #             }

            #         })
            # elif val == 'TABLE':
            #     if region['tags'][0]==(key):
            #     # try:
            #     #     # annotationTagsValue = formatAnnotationLookup[region['tags'][0]]
            #     # except KeyError as ke:
            #     #     annotationTagsValue =  region['tags'][0] 
            #         rois.append({
            #             "annotationTags": str(key),
            #             "extractionMethod": str(val),
            #             "roiId": str(roiIndex),
            #             "index": index,
            #             "rect": {
            #                 "top": int(region['boundingBox']['top']),
            #                 "left": int(region['boundingBox']['left']),
            #                 "bottom": int(region['boundingBox']['top']) + int(region['boundingBox']['height']),
            #                 "right": int(region['boundingBox']['left']) + int(region['boundingBox']['width'])
            #             }

                    # })
            if region['tags'][0].startswith(i):
                # item = region['tags'][0].split(separator,1)[0]
                # item = item[0:-1]
                if 'NO' in region['tags'][0]:
                # try:
                #     # annotationTagsValue = formatAnnotationLookup[region['tags'][0]]
                # except KeyError as ke:
                #     annotationTagsValue =  region['tags'][0] 
                    rois.append({
                        "annotationTags": str(region['tags'][0]),
                        "extractionMethod": str('NUMERIC_CLASSIFICATION'),
                        "roiId": str(roiIndex),
                        "index": index,
                        "rect": {
                            "top": int(region['boundingBox']['top']),
                            "left": int(region['boundingBox']['left']),
                            "bottom": int(region['boundingBox']['top']) + int(region['boundingBox']['height']),
                            "right": int(region['boundingBox']['left']) + int(region['boundingBox']['width'])
                        }

                    })
            index = index + 1
            roiIndex = roiIndex +1
        return rois
    
    # , formatLookup,formatNameLookup,formatAnnotationLookup
    def get_cells(self, regions, tagroup_list):
        region_n = 0
        cells_data = []
        renderIndex = 1
        cellIndex =1
        for i in tagroup_list: 
                # try:
                #     # formatValue = formatLookup[str(tagGroup)]
                # except KeyError as ke:
                #     # formatValue =  str(tagGroup)       
                # try:
                #     # formatName = formatNameLookup[str(tagGroup)]
                # except KeyError as ke:
                #     formatName =  str(tagGroup)
                # ,formatAnnotationLookup, formatName, formatValue
                cells_data.append({
                            "cellId": str(cellIndex),
                            "rois": self.get_rois(regions, i),
                            "render": {
                                "index": renderIndex
                            },
                            "format": {
                                "name":  str(i),
                                "value": str(i)
                            },
                            "validate": {
                                "regExp": ""
                            }
                })
                renderIndex = renderIndex +1   
                cellIndex = cellIndex +1
                region_n = region_n + 1 
        return cells_data
    
    def get_layout(self, cells):
        layout_data = []
        layout_data.append({
            "layout": {
                "version": "1.0",
                "name": "PersonalDetails_Form",
                "Threshold":{
                    "minWidth": "",
                    "minHeight":"",
                    "detectionRadius":"",
                    "experimentalOMRDetection":""
                },
                "resultvalidation":{
                    "validate":{
                        "regExp":"",
                        "errorMsg":""
                    }

                },
                
            "cells": cells
                
        }
        })    
        return layout_data[0]

    def pp_json(self, json_thing, sort=True, indents=4):
        if type(json_thing) is str:
            # print(json.dumps(json.loads(json_thing), sort_keys=sort, indent=indents))
            json_object = json.dumps(json.loads(json_thing), sort_keys=sort, indent=indents)
            # with open("backend_layout_roi.json", "w") as outfile:
                # outfile.write(json_object)
        else:
            # print(json.dumps(json_thing, sort_keys=sort, indent=indents))
            json_object = json.dumps(json_thing, sort_keys=sort, indent=indents)
            with open("backend_layout_roi.json", "w") as outfile:
                outfile.write(json_object)
        
        return json_object
    
    def api_connection(self, json_object):
        # connection = http.client.HTTPSConnection("localhost", 3000)
        # print("connection",connection)
        # payload = json.dumps({
        #     "layout_name": "test_form",
        #     "roi": json_object,
        #     })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MDAyIiwic2Nob29sSWQiOiJ1MDAyIiwiJGNvbW1lbnQiOiJUb2tlbiBnZW5lcmF0aW9uIiwiaWF0IjoxNjk2Njc4Nzk2fQ.CEcIlDM5v2ojqax4WRSe64P0EubgjklgQsFbgqs3jSQ',
            'methods': 'POST',
            'Origin': 'http://192.168.31.200:3000',
            'Content-Type': 'application/json'}
        res = requests.post('http://localhost:3000/roi', json = {
            "layout_name": "test_form",
            "roi": json.loads(json_object),
            }, headers = headers)
        print(res)

def main():
    tagroup_list=[]
    separator = '_'
    backend_roi = Generate_backend_roi()
    regions = backend_roi.get_annotation('/home/venkateshiyer/Documents/layout_output/5429894d64d0215791fb62b4518d0555-asset.json')
    for item in regions:
        tagroup = item['tags']
        tagroup_item = tagroup[0].split(separator,1)[0]
        if not tagroup_item in tagroup_list:
            # tagroup_item_key = tagroup_item.split(separator,1)[0]
            # tagroup_item_value = tagroup_item.split(separator,1)[1]
            # tagroup_dict[tagroup_item_key] = tagroup_item_value
            tagroup_list.append(tagroup_item)
    cells = backend_roi.get_cells(regions, tagroup_list)
    all_data = backend_roi.get_layout(cells)
    layout_json_object = backend_roi.pp_json(all_data, False)
    print('backend layout roi generated!')
    backend_roi.api_connection(layout_json_object)

if __name__=='__main__':
    main()
