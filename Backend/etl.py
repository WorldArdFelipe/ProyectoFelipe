import pandas as pd
from sklearn import preprocessing
from xgboost import XGBClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score
import joblib
import firebase
from sklearn.ensemble import RandomForestClassifier
from joblib import load


ROUTE_SAVE = "export_model/"
NAME_SAVE_MODEL = "model.pkl"

class EtlAnalytics:
    def __init__(self,name_file):
        
        self.firebase = firebase.FireBase()
        self.file = name_file
        self.dataframe = None
        self.dataframe_etl = None
        self.score_get = {}
        self.load_csv()
        
    def load_csv(self):
        self.dataframe = pd.read_csv(self.file)
    
    def transformation_var(self):
        self.dataframe['ini_sin_new'] = pd.to_datetime(self.dataframe['ini_sin_'],format="%d/%m/%Y")
        self.dataframe['fec_con_new'] = pd.to_datetime(self.dataframe['fec_con_'],format="%d/%m/%Y")
        self.dataframe['diff_days_sin'] = (self.dataframe['fec_con_new'] - self.dataframe['ini_sin_new']).dt.days
        self.dataframe['clasfinal_new'] = preprocessing.LabelEncoder().fit_transform(self.dataframe['clasfinal'])
        self.dataframe['sexo_new'] = preprocessing.LabelEncoder().fit_transform(self.dataframe['sexo_'])
        self.dataframe['def_clas_edad_new'] = preprocessing.LabelEncoder().fit_transform(self.dataframe['def_clas_edad'])
        
        self.dataframe_etl = self.dataframe[["diff_days_sin","def_clas_edad_new","sexo_new","fiebre","cefalea","dolrretroo",
                                             "malgias","artralgia","erupcionr","dolor_abdo","vomito","diarrea","somnolenci","hipotensio",
                      "hem_mucosa","hipotermia","aum_hemato","clasfinal_new"]]
    
        print(self.dataframe_etl)
        
    def get_params(self):
        data_train =  self.dataframe_etl.sample(frac=0.8,random_state=42)
        data_test =  self.dataframe_etl.drop(data_train.index)
        
        x_train = data_train.drop(["clasfinal_new"],axis=1)
        y_train = data_train[["clasfinal_new"]]

        x_test = data_test.drop(["clasfinal_new"],axis=1)
        y_test = data_test[["clasfinal_new"]]
        
        return (x_train,y_train,x_test,y_test)
                    
    def creation_model(self):
        (x_train,y_train,x_test,y_test) = self.get_params()
        
        modelos = {
            "XGBClassifier" : XGBClassifier(),
            "RandomForestClassifier": RandomForestClassifier(max_depth=2, random_state=42),
        }
                
        for key, values in modelos.items():
            model = values
            model.fit(x_train,y_train)
            self.save_model(model,key)
            self.set_score(key,model,x_train,y_train,x_test,y_test)


    def set_score(self,key,model,x_train,y_train,x_test,y_test):
        y_predict = model.predict(x_test)

        score_train_var = model.score(x_train,y_train)
        score_test_var = model.score(x_test,y_test)
        f1_score_var = f1_score(y_test,y_predict,average='weighted')
        
        #self.score_get["F1 Score"] = f1_score_var
        #self.score_get["Score Train"] = score_train_var
        #self.score_get["Score Test"] = score_test_var

        self.firebase.edit_registro(key,f1_score_var,score_train_var,score_test_var)

    def load_model_presave(self,model_get):
        
        (x_train,y_train,x_test,y_test) = self.get_params()
        
        model = load(ROUTE_SAVE+model_get+".pkl")
        y_predict = model.predict(x_test)
        
        score_train_var = model.score(x_train,y_train)
        score_test_var = model.score(x_test,y_test)
        f1_score_var = f1_score(y_test,y_predict,average='weighted')
        
        self.score_get["F1 Score"] = f1_score_var
        self.score_get["Score Train"] = score_train_var
        self.score_get["Score Test"] = score_test_var
    

    def save_model(self,model,name):
        joblib.dump(model, ROUTE_SAVE+name+".pkl")
        
    def get_score(self):
        return self.score_get
    
    def get_describe(self):
        return self.dataframe_etl.describe().to_json()