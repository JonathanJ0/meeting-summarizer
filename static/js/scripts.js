document.addEventListener("DOMContentLoaded", () => {
    // Summarize Form
    const summarizeForm = document.getElementById("summarize-form");
    if (summarizeForm) {
        summarizeForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = document.getElementById("summarize-text").value;
            const resultDiv = document.getElementById("summarize-result");
            resultDiv.innerHTML = "<p>Generating summary...</p>";

            try {
                const response = await fetch("/summarize", {
                    method: "POST",
                    body: new FormData(summarizeForm)
                });
                const data = await response.json();
                resultDiv.innerHTML = `<div class="alert alert-success"><strong>Summary:</strong> ${data.summary}</div>`;
            } catch (error) {
                resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            }
        });
    }

    // Extract Tasks Form
    const extractForm = document.getElementById("extract-form");
    if (extractForm) {
        extractForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = document.getElementById("extract-text").value;
            const resultDiv = document.getElementById("extract-result");
            resultDiv.innerHTML = "<p>Extracting tasks...</p>";

            try {
                const response = await fetch("/extract-tasks", {
                    method: "POST",
                    body: new FormData(extractForm)
                });
                const data = await response.json();
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Tasks:</strong> ${data.tasks.length ? data.tasks.join("<br>") : "None"}<br>
                        <strong>Deadlines:</strong> ${data.deadlines.length ? data.deadlines.join("<br>") : "None"}
                    </div>`;
            } catch (error) {
                resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            }
        });
    }

    // Meeting Page
    const startMeetingBtn = document.getElementById("start-meeting");
    const startLiveBtn = document.getElementById("start-live");
    const stopLiveBtn = document.getElementById("stop-live");
    const liveDiv = document.getElementById("live-transcription");
    const meetingResultDiv = document.getElementById("meeting-result");
    let eventSource;

    if (startMeetingBtn) {
        startMeetingBtn.addEventListener("click", async () => {
            meetingResultDiv.innerHTML = "<p>Processing meeting... Check terminal to speak!</p>";
            try {
                const response = await fetch("/meeting", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                meetingResultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Transcription:</strong><br>${data.transcription}<br><br>
                        <strong>Summary:</strong> ${data.summary}<br><br>
                        <strong>Tasks:</strong> ${data.tasks.length ? data.tasks.join("<br>") : "None"}<br>
                        <strong>Deadlines:</strong> ${data.deadlines.length ? data.deadlines.join("<br>") : "None"}
                    </div>`;
            } catch (error) {
                meetingResultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            }
        });
    }

    if (startLiveBtn) {
        startLiveBtn.addEventListener("click", () => {
            liveDiv.textContent = "Starting live transcription...";
            startLiveBtn.disabled = true;
            stopLiveBtn.disabled = false;

            eventSource = new EventSource("/stream");
            eventSource.onmessage = (event) => {
                if (event.data) {
                    liveDiv.textContent += `\n${event.data}`;
                }
            };
            eventSource.onerror = () => {
                liveDiv.textContent += "\nError in live transcription. Please restart.";
                eventSource.close();
                startLiveBtn.disabled = false;
                stopLiveBtn.disabled = true;
            };
        });

        stopLiveBtn.addEventListener("click", () => {
            if (eventSource) {
                eventSource.close();
                liveDiv.textContent += "\nLive transcription stopped.";
                startLiveBtn.disabled = false;
                stopLiveBtn.disabled = true;
            }
        });
    }
});