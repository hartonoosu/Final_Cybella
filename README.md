# Final Version of CybellaAI

# Frontend = CybellaAI  (Face Emotion Detection)

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

# Backend = Speech Emotion Detection (Voice)

Please follow the `INSTALL_BACKEND.md` for the full installation instruction.

## Steps to Run the Backend

1. Open backend directory in the terminal:

    ```bash
    cd Backend-CybellaAI
    ```

2. Activate the virtual environment:

    - On macOS:
        ```bash
        source venv311/bin/activate
        ```
    - On Windows:
        ```bash
        .\venv311\Scripts\activate
        ```

3. Start the server by running:

    ```bash
    uvicorn main:app --host 0.0.0.0 --port 5000 --reload
    ```

    (Note: this may take longer on the first run after installation)

4. Once it shows:

    ```
    INFO:     Started server process [70466]
    INFO:     Waiting for application startup.
    INFO:     Application startup complete.
    ```

    Then the backend is successfully running.

5. On macOS: if port 5000 is already being used, try turning off AirPlay from the macbook settings

