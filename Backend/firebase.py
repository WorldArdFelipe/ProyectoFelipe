from firebase_admin import credentials, firestore
import firebase_admin

cred = credentials.Certificate("analyticsw-81680-firebase-adminsdk-vv7ec-a89aad4dcf.json")
firebase_admin.initialize_app(cred)

#ZzbZos42Lv66nibBsyaS
class FireBase:
    def __init__(self):
        self.db = firestore.client()
    
    def edit_registro(self,name,f1_score,score_train,score_test):
        doc_ref = self.db.collection('ScoreModels').document(name)
        doc_ref.set({
            "F1 Score": str(round(f1_score,3)),
            "Score Test": str(round(score_train,3)),
            "Score Train": str(round(score_test,3))
        })