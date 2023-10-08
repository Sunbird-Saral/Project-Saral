import uuid
import json

class Generate_backend_roi:
    # def __init__(self, filename):
    #     self.filename=filename
    
    def get_annotation(self, filename):
        with open(filename) as f:
            data = json.load(f)
            f.close()
            return data['regions']
    # , formatAnnotationLookup
    def get_rois(self, regions, key,val):
        rois = []
        index = 0
        roiIndex = 1
        for region in regions:
            if val == 'FTE':
                if region['tags'][0]==(key):
                # try:
                #     # annotationTagsValue = formatAnnotationLookup[region['tags'][0]]
                # except KeyError as ke:
                #     annotationTagsValue =  region['tags'][0]
                    rois.append({
                        "annotationTags": str(key),
                        "extractionMethod": str(val),
                        "roiId": str(roiIndex),
                        "index": index,
                        "rect": {
                            # "top": top,
                            # "left": left,
                            # "bottom": bottom,
                            # "right": right
                            "top": int(region['boundingBox']['top']),
                            "left": int(region['boundingBox']['left']),
                            "bottom": int(region['boundingBox']['top']) + int(region['boundingBox']['height']),
                            "right": int(region['boundingBox']['left']) + int(region['boundingBox']['width'])
                        }

                    })
            elif val == 'TABLE':
                if region['tags'][0]==(key):
                # try:
                #     # annotationTagsValue = formatAnnotationLookup[region['tags'][0]]
                # except KeyError as ke:
                #     annotationTagsValue =  region['tags'][0] 
                    rois.append({
                        "annotationTags": str(key),
                        "extractionMethod": str(val),
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
    def get_cells(self, regions, tag_groups):
        region_n = 0
        cells_data = []
        renderIndex = 1
        cellIndex =1
        for key, val in tag_groups.items(): 
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
                            "rois": self.get_rois(regions,key, val),
                            "render": {
                                "index": renderIndex
                            },
                            "format": {
                                "name":  str(key),
                                "value": str(key)
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
                "name": "Invoice_Form",
                "cells": cells
            }
        })    
        return layout_data[0]

    def pp_json(self, json_thing, sort=True, indents=4):
        if type(json_thing) is str:
            # print(json.dumps(json.loads(json_thing), sort_keys=sort, indent=indents))
            json_object = json.dumps(json.loads(json_thing), sort_keys=sort, indent=indents)
            with open("backend_layour_roi.json", "w") as outfile:
                outfile.write(json_object)
        else:
            # print(json.dumps(json_thing, sort_keys=sort, indent=indents))
            json_object = json.dumps(json_thing, sort_keys=sort, indent=indents)
            with open("backend_layour_roi.json", "w") as outfile:
                outfile.write(json_object)
        return None

def main():
    tagroup_dict={}
    separator = '_'
    backend_roi = Generate_backend_roi()
    regions = backend_roi.get_annotation('/home/venkateshiyer/Documents/output/c88120a65f1a995e33681775a1e84f1c-asset.json')
    for item in regions:
        tagroup = item['tags']
        tagroup_item = tagroup[0]
        if not tagroup_item in tagroup_dict:
            tagroup_dict[tagroup_item] = tagroup_item.split(separator,1)[1]
    cells = backend_roi.get_cells(regions, tagroup_dict)
    layout_data = backend_roi.pp_json(cells, False)
    print('backend layout roi generated!')

if __name__=='__main__':
    main()

 

# separator = '_'
# new_list = {}
# for items in regions:
#     tagroup = items['tags']
#     tagroup_item = tagroup[0]
#     if not tagroup_item in new_list:
#         new_list[tagroup_item] = tagroup_item.split(separator,1)[1]
#         # new_list.append(tagroup.split(separator,1)[0])

# print(new_list)
# c.get_cells(regions, new_list)