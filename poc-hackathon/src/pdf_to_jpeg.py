from pdf2image import convert_from_path
import os
class Convert_image:
    def __init__(self, path_to_read, path_to_write):
        self.path_to_read = path_to_read
        self.path_to_write = path_to_write
    
    def convert_to_jpeg(self):
        for pdf in os.listdir(self.path_to_read):
            image = convert_from_path(self.path_to_read+pdf, 500)
            for count, page in enumerate(image):
                page.save(pdf +'_'+str(count)+'.jpeg', 'JPEG')

def main():
    convert = Convert_image(path_to_read='./trial_dataset/pdfs/', path_to_write='./trail_dataset/jpegs/')
    convert.convert_to_jpeg()

if __name__ =='__main__':
    main()


