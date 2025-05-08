import os
import docx
import csv
import re

# Folder path
folder_path = r"C:\Users\Steph\AMR\ResistAI\backend\Data Processing\ASTER"  # Change this to your folder path
csv_file = "ASTER.csv"  # Output

# Column Header (Updated header as per request)
columns = [
    "Year", "Sex", "Age", "Specimen_Type", "Culture",
    "Benzylpenicillin", "Oxacillin", "Ampicillin", "Ticarcillin", "Amoxicillin/Clavulanic Acid",
    "Piperacillin/Tazobactam", "Cefoperazone/Sulbactam", "Ticarcillin/Clavulanic Acid", "Ceftazidime/Avibactam",
    "Ampicillin/ Sulbactam", "Ceftolozane/Tazobactam", "Cefoxitin", "Ceftizoxime", "Cefuroxime",
    "Cefuroxime Axetil", "Ceftriaxone", "Cefepime", "Cefixime", "Ceftazidime", "Amikacin",
    "Gentamicin", "Daptomycin", "Vancomycin", "Teicoplanin", "Erythromycin", "Tetracycline",
    "Ciprofloxacin", "Norfloxacin", "Levofloxacin", "Ofloxacin", "Doripenem", "Ertapenem",
    "Imipenem", "Meropenem", "Clindamycin", "Linezolid", "Rifampin", "Fosfomycin",
    "Nitrofurantoin", "Trimethoprim/Sulfamethoxazole", "Netilmicin", "Tigecycline",
    "Minocycline", "Aztreonam", "Colistin", "Nalidixic acid", "Flucytosine",
    "Tobramycin", "Doxycycline", "Chloramphenicol", "Polymyxin B", "Fluconazole", "Voriconazole",
    "Caspofungin", "Micafungin", "Amphotericin B"
]

# Regex Pattern
patterns = {
    "Lab_Id": r"LAB ID:\s*(\d+)",
    "Collection_Date": r"COLLECTION DATE:\s*([\d/]+)",
    "Reporting_Date": r"REPORTING DATE:\s*([\d/]+)",
    "Patient_Name": r"PATIENT NAME:\s*([\w\s]+)\/(\d+)\s*YEARS\s*\/\s*(MALE|FEMALE)",
    "Doctor": r"REF BY:\s*(DR\.\s+.+)",
    "Specimen_Type": r"(SPECIMEN(?: SOURCE)?)\s*:\s*(\w+)",
    "Red_Blood_Cells": r"Red blood cells:\s*([\w\s\(\)-]+)",
    "Pus_Cells": r"Pus Cells:\s*([\w\s\(\)-]+)",
    "Epithelial_Cells": r"Epithelial Cells:\s*([\w\s\(\)-]+)",
    "Casts": r"Casts:\s*(\w+)",
    "Crystals": r"Crystals:\s*(\w+)",
    "Amorphous_Material": r"Amorphous material:\s*(\w+)",
    "Yeast": r"Yeast:\s*(\w+)",
    "Bacteria": r"(Significant growth of|Growth of|Growth|A rich growth of|Insignificant growth of)\s*(\w+\s*\w*)?",
    "Colony_Count": r"Colony Count\s*>\s*([\d,]+)\s*CFU/ml"
}

def extract_data(text, pattern):
    """Extracts data using regex, returns match or empty string."""
    match = re.search(pattern, text)
    return match.groups() if match else (" ",) * 3  # Return empty tuple if not found

def clean_data(value):
    """Clean and format the data for CSV, strip unnecessary symbols."""
    if isinstance(value, str):
        # Remove unnecessary characters like parentheses and unwanted spaces
        value = re.sub(r"[^\w\s,]", "", value).strip()
    return value

def extract_susceptibility_from_table(doc):
    """Extracts antimicrobial susceptibility results from tables in a Word document."""
    # Initialize all antimicrobial agents as empty
    susceptibility_data = {key: "" for key in columns[4:]}

    # Normalize column names for better matching
    column_lookup = {key.lower().replace(" ", "").replace("/", ""): key for key in susceptibility_data.keys()}

    for table in doc.tables:
        for row in table.rows:
            cells = [clean_data(cell.text) for cell in row.cells]

            # Ignore classes
            if not cells or cells[0] in ['ANTIMICROBIAL CLASS', 'PENICILLINS', 'AMINOGLYCOSIDE', 'FLUOROQUINOLONES', 'CEPHALOSPORINS']:
                continue

            # Check if the row has at least 2 columns
            if len(cells) >= 2:
                antimicrobial_agent = cells[1].strip().lower().replace(" ", "").replace("/", "")  # Normalize name
                result = cells[-1].upper()  # Last column = Result (e.g., SENSITIVE(++), RESISTANT)

                # Standardize Results
                if re.search(r"SENSITIVE\s*\(\+{1,9}\)", result):
                    result = "S"
                elif "SENSITIVE" in result:
                    result = "S"
                elif "RESISTANT" in result:
                    result = "R"
                elif "INTERMEDIATE" in result:
                    result = "I"

                # Store only if agent exists in predefined headers
                if antimicrobial_agent in column_lookup:
                    susceptibility_data[column_lookup[antimicrobial_agent]] = result

    return susceptibility_data

# Open CSV file for writing
with open(csv_file, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(columns)  # Write column headers

    for docx_file in os.listdir(folder_path):
        if docx_file.endswith(".docx"):
            doc_path = os.path.join(folder_path, docx_file)
            doc = docx.Document(doc_path)
            text = "\n".join([p.text for p in doc.paragraphs])

            row_data = {}

            # Extract values for all columns from text
            for col in patterns.keys():
                row_data[col] = extract_data(text, patterns[col])
                print(f"Extracted {col}: {row_data[col]}")  # Debugging output

            # Handle Patient_Name specifically
            patient_info = row_data.get("Patient_Name", None)
            if patient_info:
                patient_name, age, sex = patient_info
                name_parts = patient_name.strip().split()
                row_data["First_Name"] = name_parts[0] if name_parts else ""
                row_data["Last_Name"] = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
                row_data["Age (Yrs)"] = age
                row_data["Sex"] = sex
            else:
                # Default values if patient info is not found
                row_data["First_Name"] = ""
                row_data["Last_Name"] = ""
                row_data["Age (Yrs)"] = ""
                row_data["Sex"] = ""

            # Extract antimicrobial susceptibility data from tables
            susceptibility_results = extract_susceptibility_from_table(doc)

            # Add susceptibility data to row_data
            row_data.update(susceptibility_results)

            # Debugging output for susceptibility results
            print(f"Susceptibility Results for {docx_file}: {susceptibility_results}")

            # Prepare row in CSV format, clean the data before writing
            row = [
                clean_data(row_data.get("Collection_Date", "")),  # Add 'Year' or similar
                clean_data(row_data.get("Sex", "")),
                clean_data(row_data.get("Age (Yrs)", "")),
                clean_data(row_data.get("Specimen_Type", "")),
                clean_data(row_data.get("Bacteria", "")),  # Culture or bacteria info
            ] + [clean_data(row_data.get(col, "")) for col in columns[4:]]

            # Debugging output before writing to CSV
            print(f"Row Data: {row}")

            writer.writerow(row)

print("Data successfully extracted")
