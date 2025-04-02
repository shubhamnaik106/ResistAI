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
    
    features = ['Sex', 'Age', 'Specimen_Type']
    targets = data.columns[4:]
    X = data[features]
    y = data[targets]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Age']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type'])
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
    print("Received JSON Data:", data)
    
    model_type = 'lr'  # Model selection
    
    # Map gender to match dataset values
    sex_mapping = {'Male': '1', 'Female': '0'}
    new_gen = sex_mapping.get(data['gender'], 'Unknown')
    
    
    new_patient = pd.DataFrame({
        'Sex': [new_gen],
        'Age': [data['age']],
        'Specimen_Type': [data['specimenType'].strip().upper()]
    })
    
    
    # Convert data types
    new_patient['Age'] = pd.to_numeric(new_patient['Age'], errors='coerce')
    new_patient['Sex'] = new_patient['Sex'].astype(str)
    #print("New Patient Data Types:\n", new_patient.dtypes)
    
    # Check for NaN values
    if new_patient.isnull().values.any():
        print("ERROR: NaN values detected in new_patient DataFrame!")
        print(new_patient)
        return jsonify({"error": "Invalid input data (contains NaN)."})
    
    # Select the model pipeline
    if model_type == 'lr':
        pipeline, target_columns, metrics = lr_pipeline, lr_target_colume, lr_metrics
    else:
        pipeline, target_columns, metrics = xgb_pipeline, xgb_columns, xgb_metrics
    
    # Perform prediction
    new_prediction = pipeline.predict(new_patient)[0]
    prediction = dict(zip(target_columns, new_prediction))
    #print("Target Columns:", target_columns)
    #print("Prediction Dictionary:", prediction)
    
    # Load dataset
    dataset = pd.read_excel('Urine Dataset.xlsx')
    
    
    # Convert dataset columns to standard types
    dataset['Sex'] = dataset['Sex'].astype(str)
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
        (dataset['Specimen_Type'] == new_patient['Specimen_Type'].values[0])
    ]
    
    if filtered_dataset.empty: #or filtered_dataset.shape[0] <30
        print("No matching data found for the given input! or insuffitient data for predictions")
        return jsonify({"error": "No matching data found for given input. or insuffitient data for predictions"})
    
    
    resistance_status = []
    for col in target_columns:
        total_resistant = (filtered_dataset[col] == -1).sum()
        total_sensitive = (filtered_dataset[col] == 1).sum()
        total_valid = total_resistant + total_sensitive
        
        resistance_R = ((total_resistant / total_valid) * 100) if total_valid > 0 else 0
        sensitive_S = ((total_sensitive / total_valid) * 100) if total_valid > 0 else 0
        
        status = "Resistant" if prediction[col] == 1 else "Sensitive"
        resistance_status.append({
            "antibiotic": col,
            "resistance_status": status,
            "resistance": round(resistance_R, 2),
            "sensitive": round(sensitive_S, 2)
        })
    
    return jsonify({"predictions": resistance_status})




if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5005)
