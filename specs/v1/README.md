# Saral v1 spec and ROI layout Generation #
## Jupyter Notebook to transform Raw VoTT Json to v1 ROI Layout Json ##
* Change Directory to ./jupyter-notebook from terminal
* Execute below command to open Jupyter notebook
 >>  `jupyter notebook`
* Above command opens up http://localhost:8889/tree in browser.

* Refer `transform_sat_odisha_voot_to_roi.ipynb` in the notebook for Odisha SAT Exam transformation. It generates all the elements in ROI layout except validate regExp which needs to be hand coded. Any additional manual tweaks can be done to generated json as needed.

* Use Microsoft VoTT (Visual Object Tagging Tool) to tag all the ROI sections to be recognized with proper tag pattern and generate Raw VoTT Json.

* Feed the generated raw VoTT Json to `transform_sat_odisha_voot_to_roi.ipynb` notebook as input file to generte ROI configuration.

* Use transformed Json output from jupyter notebook and use it for backend ROI configuration.

* Use above process to generate roi layouts configuration for required layout sheets.