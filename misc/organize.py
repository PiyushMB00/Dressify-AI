import os
import shutil

# Define the directory structure
folders = [
    'templates',
    'static/css',
    'static/js',
    'routes',
    'uploads',
    'flask_session'
]

# Create the folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Define where files should go
for filename in os.listdir('.'):
    # Skip the organization script itself and the main app.py
    if filename == 'organize_project.py' or filename == 'app.py' or filename == '.env':
        continue
    
    # Move HTML files
    if filename.endswith('.html'):
        shutil.move(filename, os.path.join('templates', filename))
    
    # Move CSS files
    elif filename.endswith('.css'):
        shutil.move(filename, os.path.join('static/css', filename))
        
    # Move JS files
    elif filename.endswith('.js'):
        shutil.move(filename, os.path.join('static/js', filename))
        
    # Move Blueprint route
    elif filename.endswith('_routes.py') or filename in ['extensions.py']:
        shutil.move(filename, os.path.join('routes', filename))

    # Move everything else into a 'misc' folder (optional)
    else:
        if os.path.isfile(filename): # Only move files, not other folders
            os.makedirs('misc', exist_ok=True)
            shutil.move(filename, os.path.join('misc', filename))

print("✅ Project organized successfully!")