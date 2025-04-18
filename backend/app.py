from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.multioutput import MultiOutputClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, recall_score
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5000"}})
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
    data['Culture'] = data['Culture'].astype(str)
    features = ['Sex', 'Age', 'Specimen_Type', 'Culture']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture'])
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
def train_KNN():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    data['Culture'] = data['Culture'].astype(str)
    features = ['Sex', 'Age', 'Specimen_Type', 'Culture']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture'])
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(KNeighborsClassifier(n_neighbors=5)))
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

def train_RD():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    data['Culture'] = data['Culture'].astype(str)
    features = ['Sex', 'Age', 'Specimen_Type', 'Culture']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture'])
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42)))
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

def train_SVM():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    data['Culture'] = data['Culture'].astype(str)
    features = ['Sex', 'Age', 'Specimen_Type', 'Culture']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture'])
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(SVC(kernel='linear', probability=True)))
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
svm_pipeline, svm_target_colume, svm_metrics = train_SVM()
knn_pipeline, knn_target_colume, knn_metrics = train_KNN()
rf_pipeline, rf_target_colume, rf_metrics = train_RD()


@app.route("/", methods=["POST"])
def predict():
    data = request.get_json()
    print("Received JSON Data:", data)
    
    model_type = data["model"] # Model selection
    
    # Map gender to match dataset values
    sex_mapping = {'Male': '1', 'Female': '0'}
    new_gen = sex_mapping.get(data['gender'], 'Unknown')
    
    
    new_patient = pd.DataFrame({
        'Sex': [new_gen],
        'Age': [data['age']],
        'Specimen_Type': [data['specimenType'].strip().upper()],
        'Culture' : ['Escherichia coli']
    })
    
    
    # Convert data types
    new_patient['Age'] = pd.to_numeric(new_patient['Age'], errors='coerce')
    new_patient['Sex'] = new_patient['Sex'].astype(str)
    new_patient['Culture'] = new_patient['Culture'].astype(str)
    #print("New Patient Data Types:\n", new_patient.dtypes)
    
    # Check for NaN values
    if new_patient.isnull().values.any():
        print("ERROR: NaN values detected in new_patient DataFrame!")
        print(new_patient)
        return jsonify({"error": "Invalid input data (contains NaN)."})
    
    # Select the model pipeline
    if model_type == 'lr':
        pipeline, target_columns, metrics = lr_pipeline, lr_target_colume, lr_metrics
    elif model_type == 'xgb':
        pipeline, target_columns, metrics = xgb_pipeline, xgb_columns, xgb_metrics
    elif model_type == 'knn':
        pipeline, target_columns, metrics = knn_pipeline, knn_target_colume, knn_metrics
    elif model_type == 'rf':
        pipeline, target_columns, metrics = rf_pipeline, rf_target_colume, rf_metrics
    else:
        pipeline, target_columns, metrics = svm_pipeline, svm_target_colume, svm_metrics
    # Perform prediction
    new_prediction = pipeline.predict(new_patient)[0]
    prediction = dict(zip(target_columns, new_prediction))
    print("Target Columns:", target_columns)
    print("Prediction Dictionary:", prediction)
    
    # Load dataset
    dataset = pd.read_excel('Urine Dataset.xlsx')
    
    
    # Convert dataset columns to standard types
    dataset['Sex'] = dataset['Sex'].astype(str)
    dataset['Culture'] = dataset['Culture'].astype(str)
    dataset['Specimen_Type'] = dataset['Specimen_Type'].str.strip().str.upper()
    dataset['Age'] = pd.to_numeric(dataset['Age'], errors='coerce')
    
    #print("Dataset Head (after standardization):\n", dataset.head())
    #print("Dataset Data Types:\n", dataset.dtypes)
    
    # Debugging: Check unique values in dataset
    #print("Checking mismatches...")
    #print("Unique dataset Sex values:", dataset['Sex'].unique())
    #print("Unique dataset Specimen_Type values:", dataset['Specimen_Type'].unique())
    #print("Min and Max Age in dataset:", dataset['Age'].min(), dataset['Age'].max())
    
    # Filter dataset for matching values
    print("Filtering dataset for matching values...")
    filtered_dataset = dataset[
        (dataset['Sex'] == new_patient['Sex'].values[0]) &
        (dataset['Age'] == new_patient['Age'].values[0]) &
        (dataset['Specimen_Type'] == new_patient['Specimen_Type'].values[0])&
        (dataset['Culture'] == 'Escherichia coli')
    ]
    
    
    
    culture_antibiotics = pd.read_excel("Culture_Antibiotics.xlsx", sheet_name=0)
    print("Excel File Loaded Successfully.")
    print("Available Sheets:", culture_antibiotics.keys())
    # Get antibiotics for "Escherichia coli"
    if "Escherichia coli" in culture_antibiotics.columns:
        ecoli_antibiotics = culture_antibiotics["Escherichia coli"].dropna().tolist()
    else:
        return jsonify({"error": "Escherichia coli antibiotics not found in culture_antibiotics.xlsx"})
    
    resistance_status = []
    for col in target_columns:
        if col not in ecoli_antibiotics:  # **Filter only relevant antibiotics**
            print(f"Skipping {col} (Not in culture_antibiotics.xlsx)")
            continue
        total_resistant = int((filtered_dataset[col] == -1).sum())
        total_sensitive = int((filtered_dataset[col] == 1).sum())
        total_notused = int((filtered_dataset[col] == 0).sum())
        total_valid = total_resistant + total_sensitive +  total_notused
        
        resistance_R = int((total_resistant / total_valid) * 100) if total_valid > 0 else 0
        sensitive_S = int((total_sensitive / total_valid) * 100) if total_valid > 0 else 0
        notused_N = int((total_notused / total_valid) * 100) if total_valid > 0 else 0
        
         # Correct resistance status logic
        if prediction[col] == 1:
            status = "Sensitive"
        elif prediction[col] == 0:
            status = "Not Used"
        else:
            status = "Resistant"

        resistance_status.append({
            "antibiotic": col,
            "resistance_status": status,
            "resistance": round(resistance_R, 2),
            "sensitive": round(sensitive_S, 2),
            "notused": round(notused_N, 2),
            "total_resistant_patients": total_resistant,  
            "total_sensitive_patients": total_sensitive,  
            "total_notused_patients": total_notused
        })
        print("Final Resistance Status:", resistance_status)
    return jsonify({"predictions": resistance_status})




if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5005)
