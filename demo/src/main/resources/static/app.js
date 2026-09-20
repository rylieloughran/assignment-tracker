const API_URL = "http://localhost:3000/assignments";

const form = document.getElementById("assignment-form");
const container = document.getElementById("assignments-container");
const sortBy = document.getElementById("sort-by");

let assignments = [];

async function loadAssignments() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load assignments.");
        }

        assignments = await response.json();
        renderAssignments();
    } catch (error) {
        container.textContent = "Could not connect to the assignment database.";
        console.error(error);
    }
}

function renderAssignments() {
    const sortedAssignments = [...assignments];

    sortedAssignments.sort((a, b) => {
        if (sortBy.value === "due-date-asc") {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }

        if (sortBy.value === "assignment-urgency-asc") {
            return (a.urgency ?? 99) - (b.urgency ?? 99);
        }

        if (sortBy.value === "estimated-time-asc") {
            return (a.estimatedTime ?? 99999) - (b.estimatedTime ?? 99999);
        }

        return (b.estimatedTime ?? 0) - (a.estimatedTime ?? 0);
    });

    container.replaceChildren();

    if (sortedAssignments.length === 0) {
        container.textContent = "No assignments yet.";
        return;
    }

    for (const assignment of sortedAssignments) {
        const card = document.createElement("article");

        const title = document.createElement("h3");
        title.textContent = assignment.title;

        const course = document.createElement("p");
        course.textContent = `Course: ${assignment.courseName}`;

        const due = document.createElement("p");
        due.textContent = `Due: ${assignment.dueDate}`;

        const urgency = document.createElement("p");
        urgency.textContent = `Urgency: ${assignment.urgency ?? "Not set"}`;

        const time = document.createElement("p");
        time.textContent = `Estimated time: ${assignment.estimatedTime ?? "Not set"} minutes`;

        card.append(title, course, due, urgency, time);
        container.appendChild(card);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newAssignment = {
        title: document.getElementById("assignment-title").value,
        courseName: document.getElementById("course-name").value,
        dueDate: `${document.getElementById("due-date").value}T23:59:00Z`,
        urgency: Number(document.getElementById("assignment-urgency").value),
        estimatedTime: Number(document.getElementById("estimated-time").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAssignment)
        });

        if (!response.ok) {
            throw new Error("Could not save assignment.");
        }

        form.reset();
        await loadAssignments();
    } catch (error) {
        alert("Could not save the assignment. Make sure json-server is running.");
        console.error(error);
    }
});

sortBy.addEventListener("change", renderAssignments);

loadAssignments();