import os
import re
import csv


def extract_table_names(sql_folder):
    table_names = []
    create_table_pattern = re.compile(
        r'CREATE TABLE IF NOT EXISTS "public"\."(\w+)"', re.IGNORECASE)

    for root, _, files in os.walk(sql_folder):
        for file in files:
            if file.endswith('.sql'):
                with open(os.path.join(root, file), 'r') as f:
                    content = f.read()
                    matches = create_table_pattern.findall(content)
                    table_names.extend(matches)

    table_names.sort()  # Sort the table names in ascending order

    return {
        'total': len(table_names),
        'table_names': table_names
    }


sql_folder = '/Users/user/app/k3mart-newpos/src/renderer/src/db/migration-client'
result = extract_table_names(sql_folder)

# Define the CSV file path
csv_file_path = os.path.join(sql_folder, 'table_names.csv')

# Write the result to a CSV file
with open(csv_file_path, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(['Total Tables', result['total']])
    csvwriter.writerow(['Table Names'])
    for table_name in result['table_names']:
        csvwriter.writerow([table_name])

print(f"Result written to {csv_file_path}")
