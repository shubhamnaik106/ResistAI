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

CORS(app, resources={r"/predict_trends": {"origins": "http://localhost:5000"},
    r"/predict_hero": {"origins": "http://localhost:5000"},
    r"/get_antibiotics": {"origins": "http://localhost:5000"}
    })


def get_age_group(age):
    #print("Age is : ",age)
    if 0 <= age < 10:
        return '0-10'
    elif 10 <= age < 20:
        return '10-20'
    elif 20 <= age < 30:
        return '20-30'
    elif 30 <= age < 40:
        return '30-40'
    elif 40 <= age < 50:
        return '40-50'
    elif 50 <= age < 60:
        return '50-60'
    elif 60 <= age < 70:
        return '60-70'
    elif 70 <= age < 80:
        return '70-80'
    elif 80 <= age < 90:
        return '80-90'
    elif 90 <= age <= 100:
        return '90-100'
    else:
        return 'Unknown'
def train_XGB():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    data['Culture'] = data['Culture'].astype(str)
    data['Age_Group'] = data['Age'].apply(get_age_group)
    features = ['Year','Sex', 'Culture', 'Specimen_Type','Age_Group']
    targets = data.columns[5:]  

    X = data[features]
    y = data[targets].replace({-1: 0, 0: 0, 1: 1})
    valid_targets = [col for col in y.columns if set(y[col].unique()).issubset({0, 1}) and len(set(y[col].unique())) > 1]
    y = y[valid_targets]

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Year']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Year','Sex', 'Culture', 'Specimen_Type','Age_Group'])
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
    data['Age_Group'] = data['Age'].apply(get_age_group)
    #data = data[data['Age_Bin'] != 'Unknown']  # remove out-of-range ages

    features = ['Year', 'Sex', 'Specimen_Type', 'Culture', 'Age_Group']
    targets = data.columns[5:]

    X = data[features]
    y = data[targets].apply(pd.to_numeric, errors='coerce').dropna(axis=1)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Year']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type', 'Culture', 'Age_Group'])
        ]
    )

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(LogisticRegression(max_iter=1000, random_state=42)))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    single_class_targets = [col for col in y_train.columns if len(y_train[col].unique()) == 1]
    y_train = y_train.drop(columns=single_class_targets, errors='ignore')
    y_test = y_test.drop(columns=single_class_targets, errors='ignore')

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    metrics = [
        {
            "antibiotic": col,
            "accuracy": accuracy_score(y_test[col], y_pred[:, i]),
            "sensitivity": recall_score(y_test[col], y_pred[:, i], average="macro")
        }
        for i, col in enumerate(y_train.columns)
    ]

    return pipeline, y_train.columns, metrics

def train_KNN():
    data = pd.read_excel('Urine Dataset.xlsx')
    data['Sex'] = data['Sex'].astype(str)
    data['Specimen_Type'] = data['Specimen_Type'].astype(str)
    data['Culture'] = data['Culture'].astype(str)
    data['Age_Group'] = data['Age'].apply(get_age_group)
    features = ['Year','Sex', 'Age', 'Specimen_Type', 'Culture','Age_Group']
    targets = data.columns[5:]
    X = data[features]
    y = data[targets]

    # Drop non-numeric or invalid columns
    y = y.apply(pd.to_numeric, errors='coerce')
    y = y.dropna(axis=1)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Year']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture','Age_Group'])
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', MultiOutputClassifier(KNeighborsClassifier(n_neighbors=10)))
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
    data['Age_Group'] = data['Age'].apply(get_age_group)

    features = ['Year','Sex', 'Age', 'Specimen_Type', 'Culture','Age_Group']
    targets = data.columns[5:]
    X = data[features]
    y = data[targets]

    # Drop non-numeric or invalid columns
    y = y.apply(pd.to_numeric, errors='coerce')
    y = y.dropna(axis=1)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Year']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture', 'Age_Group'])
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
    data['Age_Group'] = data['Age'].apply(get_age_group)
    features = ['Year','Sex', 'Specimen_Type', 'Culture','Age_Group']
    targets = data.columns[5:]
    X = data[features]
    y = data[targets]

    # Drop non-numeric or invalid columns
    y = y.apply(pd.to_numeric, errors='coerce')
    y = y.dropna(axis=1)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['Year']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Sex', 'Specimen_Type','Culture','Age_Group'])
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


@app.route("/predict_hero", methods=["POST"])
def predict_hero():
    data = request.get_json()
    print("Received JSON Data:", data)
    print("returned age ",data['age']) 
    model_type = data["model"] # Model selection
    
    # Map gender to match dataset values
    sex_mapping = {'Male': '1', 'Female': '0'}
    new_gen = sex_mapping.get(data['gender'], 'Unknown')
    
    years = ['2023', '2022', '2024']
    

    age_label = str(get_age_group(int(data['age'])) )#modal age range as str
    print("Age label ",age_label)

    rows = []
    for year in years:
        rows.append({
            'Sex': new_gen,
            'Specimen_Type': data['specimenType'].strip().upper(),
            'Culture': 'Escherichia coli',
            'Year': year,
            'Age_Group': age_label,
            'Age' : data['age']
        })

    new_patient = pd.DataFrame(rows)

    new_patient['Year'] = pd.to_numeric(new_patient['Year'], errors='coerce')
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
    #print("Target Columns:", target_columns)
    #print("Prediction Dictionary:", prediction)
    
    # Load dataset
    dataset = pd.read_excel('Urine Dataset.xlsx')
    
    
    # Convert dataset columns to standard types
    dataset['Sex'] = dataset['Sex'].astype(str)
    dataset['Culture'] = dataset['Culture'].astype(str)
    dataset['Specimen_Type'] = dataset['Specimen_Type'].str.strip().str.upper()
    dataset['Age'] = pd.to_numeric(dataset['Age'], errors='coerce')
    dataset['Year'] = pd.to_numeric(dataset['Year'], errors='coerce')
    
    #print("Dataset Head (after standardization):\n", dataset.head())
    #print("Dataset Data Types:\n", dataset.dtypes)
    
    # Debugging: Check unique values in dataset
    #print("Checking mismatches...")
    #print("Unique dataset Sex values:", dataset['Sex'].unique())
    #print("Unique dataset Specimen_Type values:", dataset['Specimen_Type'].unique())
    #print("Min and Max Age in dataset:", dataset['Age'].min(), dataset['Age'].max())
    
    # Filter dataset for matching values
    #print("Filtering dataset for matching values...")
    age_range = new_patient['Age'].values[0]
    if 0 <= age_range < 10:
        age_min, age_max = 0, 10
    elif 10 <= age_range < 20:
        age_min, age_max = 10, 20
    elif 20 <= age_range < 30:
        age_min, age_max = 20, 30
    elif 30 <= age_range < 40:
        age_min, age_max = 30, 40
    elif 40 <= age_range < 50:
        age_min, age_max = 40, 50
    elif 50 <= age_range < 60:
        age_min, age_max = 50, 60
    elif 60 <= age_range < 70:
        age_min, age_max = 60, 70
    elif 70 <= age_range < 80:
        age_min, age_max = 70, 80
    elif 80 <= age_range < 90:
        age_min, age_max = 80, 90
    elif 90 <= age_range <= 100:
        age_min, age_max = 90, 100
    



    filtered_dataset = dataset[
        (dataset['Sex'] == new_patient['Sex'].values[0]) &
        (dataset['Age'] >= age_min) &
        (dataset['Age'] < age_max)  &
        (dataset['Specimen_Type'] == new_patient['Specimen_Type'].values[0])&
        (dataset['Culture'] == 'Escherichia coli')
    ]
    
    
    
    culture_antibiotics = pd.read_excel("Culture_Antibiotics.xlsx", sheet_name=0)
    #print("Excel File Loaded Successfully.")
    #print("Available Sheets:", culture_antibiotics.keys())
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

        if status == "Sensitive":
            if resistance_R>sensitive_S:
                status = "Resistant"

        elif status == "Resistant":
            if sensitive_S>resistance_R:
                status = "Sensitive"
            elif sensitive_S == resistance_R:
                status = "Sensitive"
                
            

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
        #print("Final Resistance Status:", resistance_status)
    return jsonify({"predictions": resistance_status})






@app.route("/predict_trends", methods=["POST"])


@app.route('/predict_trends', methods=['POST'])
def predict_trends():
    data = request.get_json()
    print("Received Trends Request:", data)

    age_range = data.get('age', None)  # Could be None
    gender = data.get('gender', None)  # Could be None
    specimen_type = data.get('specimenType', '').strip().upper()
    antibiotic_of_interest = data.get('antibiotic', '').strip()

    # Load datasets
    dataset = pd.read_excel('Urine Dataset.xlsx')
    culture_antibiotics = pd.read_excel('Culture_Antibiotics.xlsx', sheet_name=0)

    # Clean dataset
    dataset['Sex'] = dataset['Sex'].astype(str)
    dataset['Culture'] = dataset['Culture'].astype(str)
    dataset['Specimen_Type'] = dataset['Specimen_Type'].str.strip().str.upper()
    dataset['Age'] = pd.to_numeric(dataset['Age'], errors='coerce')
    dataset['Year'] = pd.to_numeric(dataset['Year'], errors='coerce')

    # Filter for E. coli
    filtered_dataset = dataset[dataset['Culture'] == 'Escherichia coli']

    # Apply gender filter only if provided
    if gender:
        sex_mapping = {'Male': '1', 'Female': '0'}
        sex = sex_mapping.get(gender, None)
        if sex is not None:
            filtered_dataset = filtered_dataset[filtered_dataset['Sex'] == sex]

    # Apply age filter only if provided
    if age_range is not None:
        if 0 <= age_range < 10:
            age_min, age_max = 0, 10
        elif 10 <= age_range < 20:
            age_min, age_max = 10, 20
        elif 20 <= age_range < 30:
            age_min, age_max = 20, 30
        elif 30 <= age_range < 40:
            age_min, age_max = 30, 40
        elif 40 <= age_range < 50:
            age_min, age_max = 40, 50
        elif 50 <= age_range < 60:
            age_min, age_max = 50, 60
        elif 60 <= age_range < 70:
            age_min, age_max = 60, 70
        elif 70 <= age_range < 80:
            age_min, age_max = 70, 80
        elif 80 <= age_range < 90:
            age_min, age_max = 80, 90
        elif 90 <= age_range <= 100:
            age_min, age_max = 90, 100
        filtered_dataset = filtered_dataset[(filtered_dataset['Age'] >= age_min) &
        (filtered_dataset['Age'] < age_max)]

    # Apply specimen type filter only if provided
    if specimen_type:
        filtered_dataset = filtered_dataset[filtered_dataset['Specimen_Type'] == specimen_type]

    # Validate antibiotic
    if antibiotic_of_interest not in filtered_dataset.columns:
        return jsonify({"error": f"{antibiotic_of_interest} not found in dataset."}), 400

    col = antibiotic_of_interest
    yearly_stats = []
    year_filter = [
    year for year in filtered_dataset['Year'].dropna().unique()
    if len(filtered_dataset[filtered_dataset['Year'] == year]) > 10]

    for year in sorted(year_filter):
        year_data = filtered_dataset[filtered_dataset['Year'] == year]
        y_total_resistant = int((year_data[col] == -1).sum())
        y_total_sensitive = int((year_data[col] == 1).sum())
        y_total_notused = int((year_data[col] == 0).sum())
        y_total_valid = y_total_resistant + y_total_sensitive + y_total_notused

        y_resistance_R = round((y_total_resistant / y_total_valid) * 100, 2) if y_total_valid > 0 else 0
        y_sensitive_S = round((y_total_sensitive / y_total_valid) * 100, 2) if y_total_valid > 0 else 0
        y_notused_N = round((y_total_notused / y_total_valid) * 100, 2) if y_total_valid > 0 else 0

        yearly_stats.append({
            "year": int(year),
            "sensitive": y_sensitive_S,
            "resistant": y_resistance_R,
            "notused": y_notused_N,
            "total_sensitive": y_total_sensitive,
            "total_resistant": y_total_resistant,
            "total_notused": y_total_notused
        })

    result = {
        "predictions": [{
            "antibiotic": antibiotic_of_interest,
            "yearly_stats": yearly_stats
        }]
    }
    return jsonify(result)



@app.route('/get_antibiotics', methods=['GET'])
def get_antibiotics():
    # Load the antibiotics dataset from Culture_Antibiotics.xlsx file
    culture_antibiotics = pd.read_excel('Culture_Antibiotics.xlsx', sheet_name=0)
    antibiotics_list = culture_antibiotics['Escherichia coli'].tolist()
    print(antibiotics_list)

    return jsonify(antibiotics_list)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5005)
