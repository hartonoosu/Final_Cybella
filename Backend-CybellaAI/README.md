# Running Locally

```bash
# Install dependencies
    npm install

# Install Vite (Optional)
    npm install vite

# Start the development server
    npm run dev
# Start the deployment on localhost using frontend and backend (Database = MongoDB atlas)
    npx netlify dev

# Run this if Permission Denied on MacOS
    chmod +x node_modules/.bin/*

```

## PowerShell as Administrator
``` bash
    netsh advfirewall firewall add rule name="Uvicorn 5000" dir=in action=allow protocol=TCP localport=5000
    netsh advfirewall firewall show rule name="Uvicorn 5000"
```

### Open a new terminal and run:
```bash
    netstat -ano | findstr :5000
    
    #Example of Output 
    TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING       <PID>

```


#### Running Backend

```bash
1. Install Python 3.11
    install python 3.11

2. Create a virtual environment
    python3.11 -m venv venv311 (MacOS)
    
    or this:

    py -3.11 -m venv venv311 (Windows)

# To change interpreter
    # on Windows
    - install python (from Microsoft) on Extensions
    - Ctrl + Shift + P and type 
        > Python: Select Interpreter
    - choose Python 3.11

    # on macOS:
    - Cmd + Shift + P
    - Type: Python: Select Interpreter
    - click "Enter interpreter path..." then click "Find"
    - navigate to the project folder and select it   

# Create folder call "static" on the backend root directory (if haven't, for debugging purposes)

4. Run this if there is any Unauthorized Access
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

5. Activate the virtual environment
    # On macOS/Linux:
    source venv311/bin/activate

    # On Windows:
    .\venv311\Scripts\activate

6. Install pip
    python -m ensurepip --upgrade

7. Install all backend dependencies from requirements.txt
    pip install -r requirements.txt

# If any missing packages during installation
    pip install --no-cache-dir --force-reinstall -r requirements.txt

8. Install FFmpeg for Windows
    Go to this link:  https://www.gyan.dev/ffmpegbuilds/ffmpeg-release-essentials.zip
    Download the ZIP and extract it to: C:\ffmpeg
    Inside that folder, go to: C:\ffmpeg\bin → You’ll see ffmpeg.exe
    Add C:\ffmpeg\bin to your system PATH:
    Open the Start menu → search “Environment Variables”
    Click “Environment Variables”
    Under “System variables” → select Path → click “Edit”
    Click “New” → paste: C:\ffmpeg\bin
    Click OK to save and close all
    Open a new terminal and test:
    ffmpeg -version → If it prints info, it’s working

# Install FFmpeg for macOS
    # Installing brew (if haven't)
    Paste to terminal : /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    Follow the prompt that looks like below (if any, please follow the prompt instead): 
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        
    To confirm: brew --version
    It should show: Homebrew 4.x.x

    # Intalling FFmmpeg
    Paste to terminal: brew install ffmpeg
    Test it: ffmpeg -version

9. For MacOS: install the required root CA certificates that Python needs to verify SSL connections.
    Paste on terminal:
    
    open /Applications/Python\ 3.11/Install\ Certificates.command

10. restart VSCode

11. Start the FastAPI backend server:
    uvicorn main:app --host 0.0.0.0 --port 5000 --reload  (Connected with backend, turn off AirPlay Receiver on MacOS if port 5000 is being used)
    


```