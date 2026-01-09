import os
import subprocess

ROOT_DIR = "Food_data"
BATCH_SIZE = 200

def run(cmd):
    subprocess.run(cmd, shell=True, check=True)

# collect all files inside food_data
files = []
for root, _, filenames in os.walk(ROOT_DIR):
    for name in filenames:
        files.append(os.path.join(root, name))

files.sort()
print(f"Total files found: {len(files)}")

batch_no = 1

for i in range(0, len(files), BATCH_SIZE):
    batch = files[i:i + BATCH_SIZE]

    for f in batch:
        run(f'git add "{f}"')

    run(f'git commit -m "Add food_data batch {batch_no}"')
    run('git push')

    print(f"Uploaded batch {batch_no}")
    batch_no += 1
