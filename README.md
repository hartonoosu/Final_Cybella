# Final Version of CybellaAI

# Frontend-CybellaAI  (Face Emotion Detection)

This is the **frontend** portion of the CybellaAI project, built using **React + Vite**. It interfaces with the backend for real-time emotion detection using facial and voice data.

---

## Clone the Repository

```bash
git clone https://github.com/hartonoosu/Final_Cybella.git
cd Final_Cybella
```

---

## Prerequisites

Ensure you have the following installed:

* **Node.js (v20)**
* **npm (Node Package Manager)**

### On Windows: 

Download Node.js from: (https://nodejs.org/en/blog/release/v20.9.0 )

After installation, verify in your terminal:

```bash
node -v
npm -v
```

If the terminal does not recognize these commands, add Node.js to your system path:

1. Press `Windows + R`, type `sysdm.cpl`, and hit Enter.
2. Go to the **Advanced** tab → Click **Environment Variables**.
3. Under **System Variables**, find `Path` → Click **Edit**.
4. Ensure this path is listed (add if missing):

```bash
C:\Program Files\nodejs\
```

### On macOS:
You can install Node.js using [Homebrew](https://brew.sh/), a popular package manager, by pasting this command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js (includes npm):

```bash
brew install node
```

For Apple Silicon (M1/M2/M3) users, if you run into issues, try this instead:
```bash
arch -x86_64 brew install node
```

After installation, verify that Node.js and npm are installed:

```bash
node -v
npm -v
```

---

## Install Netlify CLI

Netlify CLI is required to serve the frontend locally using the Vite dev server.

Install it globally (on Windows)

```bash
npm install -g netlify-cli
```

Install it globally (on macOS)

```bash
sudo npm install -g netlify-cli
```

Verify the installation:

```bash
netlify --version
```

---

## Run the Frontend Locally

1. Open your terminal and navigate to the project root:

```bash
cd Frontend-CybellaAI
```

2. Start the Netlify development server:

```bash
npx netlify dev
```

3. When prompted, select:

```
[Vite] 'npm run dev'
```

This will launch the frontend at a local development URL (typically `http://localhost:8888` or similar).

---

# Backend-CybellaAI  (Face Emotion Detection)

## 1. Install Python 3.11 (This version is required for the backend code to run properly)

### On Windows:
- Go to the official Python downloads page:
(https://www.python.org/downloads/release/python-3110/)

- Click "Windows installer (64-bit)" Under Files Table.

- Run the installer, and make sure to check the box: “Add Python 3.11 to PATH”
- Then click “Install Now”

### On macOS:
#### Install brew (if haven't). 
- Paste to terminal : 

    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

- Follow the prompt that looks like below (if any, please follow the actual prompt instead): 

    ```
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    ```   

- To confirm: 

    ```
    brew --version
    ```

    It should show: Homebrew 4.x.x

#### Install Python3.11
- Paste:
    ```
    brew install python@3.11
    ```

- To confirm:
    ```
    python3 --version
    ```
    It should show: Python 3.11.xx

## 2. Create a virtual environment

### On Windows:

```
py -3.11 -m venv venv311 (Windows)
```

### On macOS:
```
python3.11 -m venv venv311 (MacOS)
```

## 3. To change interpreter (skip this if newly created interpreter is already selected)
### On Windows
- install python (from Microsoft) on Extensions
- Ctrl + Shift + P and type 
    ```
    > Python: Select Interpreter
    ```
- choose Python 3.11

### On macOS:
- Cmd + Shift + P
- Type: Python: Select Interpreter
- click "Enter interpreter path..." then click "Find"
- navigate to the project folder and select it   

## 4. Unauthorized Access
- Run this to avoid any Unauthorized Access

    ```
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

## 5. Activate the virtual environment
### On macOS:
- Run this:
    ```
    source venv311/bin/activate
    ```
### On Windows:
- Run this: 
    ```
    .\venv311\Scripts\activate
    ```

- It will show: (venv311)
## 6. Install pip
- Run this:
    ```
    python -m ensurepip --upgrade
    ```

## 7. Install all backend dependencies from requirements.txt
- Make sure your virtual environment is activated before running pip install (See Step 5)
- Run this:
   ```
    pip install -r requirements.txt
    ```
- If any missing packages during installation (skip this if there is no error during installation)
    ```
    pip install --no-cache-dir --force-reinstall -r requirements.txt
    ```
- After the requirments file, install pymongo, python-dotenv and uvicorn.
  ```bash
  pip install pymongo
  ```
  ```bash
  pip install python-dotenv
  ```
  ```bash
  pip install uvicorn
  ```
  
## 8. Install FFmpeg 
### On Windows
- Download FFmpeg from: https://www.ffmpeg.org/download.html
- Click on the Windows button.
- After click on Windows builds from gyan.dev
- Scroll down to ‘release builds’ and download ffmpeg-release-essentials.zip
- After downloading, extract the files in your C Drive.
- Navigate to the extracted folder:
```bash
cd C:\ffmpeg\bin 
```
- Inside that folder, go to: C:\ffmpeg\bin → You’ll see ffmpeg.exe
- Add C:\ffmpeg\bin to your system PATH:
- Open the Start menu → search “Environment Variables”
- Click “Environment Variables”
- Under “System variables” → select Path → click “Edit”
- Click “New” → paste: C:\ffmpeg\bin
- Click OK to save and close all
- Open a new terminal and test:
    ```
    ffmpeg -version
    ```
    If it prints info, it’s working

### On macOS
   
- Paste on terminal: 
    ```
    brew install ffmpeg
    ```
- Test it: 
    ```
    ffmpeg -version
    ```
    If it print info, it’s working
## 9. (For macOS user only) Install the required root CA certificates that Python needs to verify SSL connections.
- Paste on terminal:
    ```
    open /Applications/Python\ 3.11/Install\ Certificates.command
    ```

## 10. Static directory for debugging purposes
- Create folder call "static" on the backend root directory (if haven't)

## 11. Restart VSCode

## 12. Start the FastAPI backend server:

```
uvicorn main:app --host 0.0.0.0 --port 5000 --reload  
```

### On macOS
- Turn off AirPlay Receiver if port 5000 is being used then run again
