# Final Version of CybellaAI

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

## Steps to Run the Frontend

1. Open a new terminal (do not close the backend terminal)

2. Navigate to the frontend directory:

    ```bash
    cd Test-CybellaAI-main
    ```

3. Start the development server:

    ```bash
    npx netlify dev
    ```

4. It will show:

    ```
    Multiple possible dev commands found 
      [Next.js] 'npm run dev' 
    ❯ [Vite] 'npm run dev' 
    ```

5. Use the arrow key to select:
    
    ```
    [Vite] 'npm run dev'
    ```

6. Once selected, it will automatically open in your default browser.

    (Recommended to use Google Chrome for better experience)
