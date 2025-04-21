import pandas as pd

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
    
    (dataset['Specimen_Type'] == 'Urine'.upper())&
    (dataset['Culture'] == 'Escherichia coli')
]
culture_antibiotics = pd.read_excel('Culture_Antibiotics.xlsx', sheet_name=0)
    
    # Assume the antibiotics are listed as columns in the dataset
antibiotics_list = culture_antibiotics['Escherichia coli'].tolist()
print(antibiotics_list)