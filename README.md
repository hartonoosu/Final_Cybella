# Final Version of CybellaAI

# Frontend = CybellaAI  (Face)

This is the **frontend** portion of the CybellaAI project, built using **React + Vite**. It interfaces with the backend for real-time emotion detection using facial and voice data.

---

## Clone the Repository

```bash
git clone https://github.com/hartonoosu/Final-Cybella.git
cd Final-Cybella
```

---

## Prerequisites

Ensure you have the following installed:

* **Node.js (v20)**
* **npm (Node Package Manager)**

Download Node.js from: [https://nodejs.org/en/download](https://nodejs.org/en/download)

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

---

## Install Netlify CLI

Netlify CLI is required to serve the frontend locally using the Vite dev server.

Install it globally:

```bash
npm install -g netlify-cli
```

Verify the installation:

```bash
netlify --version
```

---

## Run the Frontend Locally

1. Open your terminal and navigate to the project root:

```bash
cd Test-CybellaAI-main
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

Please follow the `README.md` inside the `speech-emotion-detection` directory for the full installation instruction.

## Steps to Run the Backend

1. Open backend directory in the terminal:

    ```bash
    cd speech-emotion-detection
    ```

2. Activate the virtual environment:

    - For macOS:
        ```bash
        source venv311/bin/activate
        ```
    - For Windows:
        ```bash
        .\venv311\Scripts\activate
        ```

3. Start the server by running:

    ```bash
    uvicorn main:app --host 0.0.0.0 --port 5000 --reload
    ```

    (Note: this may take longer on the first run)

4. Once it shows:

    ```
    INFO:     Started server process [70466]
    INFO:     Waiting for application startup.
    INFO:     Application startup complete.
    ```

    Then the backend is successfully running.

5. For macOS: if port 5000 is already being used, turn off AirPlay from the macbook settings

