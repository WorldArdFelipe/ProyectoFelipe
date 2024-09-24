import json
from joblib import load
import numpy as np

ROUTE_SAVE = "export_model/"

class PredictModel:
    def __init__(self,model_get):
       self.model = load(ROUTE_SAVE+model_get+".pkl")
    
    def check_values(self,arg):
        for i in arg.values():
            if i == "None" or i == "":
                return False
        return True     
            
    def prepare_var(self,arg):
        list = []
        count = 0
        for i in arg.values():
            vv = i
            if count > 1:
                vv = 1
                if i == "option2":
                    vv = 2
            if count == 0:
                vv = int(i)
            if count == 1:
                value_new = int(i)
                if value_new >= 0 and value_new <= 6 :
                    vv = 5
                elif value_new >= 7 and value_new <= 11 :
                    vv = 2
                elif value_new >= 12 and value_new <= 17 :
                    vv = 0
                elif value_new >= 18 and value_new <= 28 :
                    vv = 3
                elif value_new >= 29 and value_new <= 59 :
                    vv = 1     
                elif value_new >= 60 :
                    vv = 4  
            list.append(vv)                  
            count+=1
        return list
    
    def get_results(self,value):
        list_value = [
            "DENGUE CON SIGNOS DE ALARMA",
            "DENGUE GRAVE",
            "DENGUE SIN SIGNOS DE ALARMA",
        ]
        
        return list_value[value]
        
    def predict_model(self,arg):
        args_new = self.prepare_var(arg)
        y_predict = self.model.predict(np.array(args_new).reshape(1, -1))
        print(y_predict[0])
        return self.get_results(y_predict[0])