from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.multioutput import MultiOutputClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, recall_score
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from flask_cors import CORS
app = Flask(__name__)

CORS(app)
def train_XGB():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    
    features = ['Sex', 'Age', 'Specimen_Type']
    targets = data.columns[4:]

    X = data[features]
    y = data[targets].replace({-1: 0, 0: 0, 1: 1})
    valid_targets = [col for col in y.columns if set(y[col].unique()).issuperset({0, 1})]
    y = y[valid_targets]

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type'])
        ]
    )

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(XGBClassifier(random_state=42)))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    metrics = []
    for i, col in enumerate(y_train.columns):
        accuracy = accuracy_score(y_test[col], y_pred[:, i])
        sensitivity = recall_score(y_test[col], y_pred[:, i],average="macro")
        metrics.append({"antibiotic": col, "accuracy": accuracy, "sensitivity": sensitivity})
    
    return pipeline, y_train.columns, metrics

def train_LR():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    
    features = ['Sex', 'Age', 'Specimen_Type']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(), ['Sex', 'Specimen_Type'])
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(LogisticRegression(max_iter=1000, random_state=42)))
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    single_class_targets = [col for col in y_train.columns if len(y_train[col].unique()) == 1]
    if single_class_targets:
        y_train = y_train.drop(columns=single_class_targets)
        y_test = y_test.drop(columns=single_class_targets)
    
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    metrics = [
        {"antibiotic": col, "accuracy": accuracy_score(y_test[col], y_pred[:, i]), "sensitivity" : recall_score(y_test[col], y_pred[:, i], average="macro")  # or "weighted"
}
        for i, col in enumerate(y_train.columns)
    ]
    
    return pipeline, y_train.columns, metrics

xgb_pipeline, xgb_columns, xgb_metrics = train_XGB()
lr_pipeline, lr_target_colume, lr_metrics = train_LR()


@app.route("/", methods=["POST"])
def predict():
    data = request.get_json()
    model_type = 'LR' #LR or XGB
    new_patient = pd.DataFrame({
        'Sex': [data['gender']],
        'Age': [data['age']],
        'Specimen_Type': [data['specimenType']]
    })
    if model_type == 'lr':
        pipeline, target_columns, metrics = lr_pipeline, lr_columns, lr_metrics
    else:
        pipeline, target_columns, metrics = xgb_pipeline, xgb_columns, xgb_metrics

    new_prediction = pipeline.predict(new_patient)[0]
    prediction = dict(zip(target_columns, new_prediction))
    resistance_status = []
    for col in target_columns:
        status = "Resistant" if prediction[col] == 1 else "Sensitive"
        resistance_status.append({
            "antibiotic": col, 
            "resistance_status": status
        })

    return jsonify({"predictions": resistance_status})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5005)
