window.onload = loadTasks;

    // Lisää 'submit' -tapahtumakäsittelijä lomakkeelle
    document.querySelector("form").addEventListener("submit", e => {
        e.preventDefault();
        addTask();
    });

// Sivu noutaa kaikki tehtävät localStorage:sta sovelluksen ladatessa 
function loadTasks() {
    // tarkista localStorage tehtävät
    if (localStorage.getItem("tasks") == null) return;
    // Noutaa tehtävät localStoragesta siirtäen tiedot "jonoon"
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

    // Silmukoi tehtävät läpi ja lisää ne listaan
    tasks.forEach(task => {
        const list = document.querySelector("ul");
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? "checked" : ""}>
        <input type="text" value="${task.task}" class="task ${task.completed ? "completed" : ""}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
        list.insertBefore(li, list.children[0]);
    });
}

function addTask() {
    const task = document.querySelector("form input");
    const list = document.querySelector("ul");
    // palauta, jos tehtävä on tyhjä
    if (task.value === "") {
        alert("Please add a task!");
        return false;
    }
    // tarkista onko tehtävää jo olemassa
    if (document.querySelector('input[value="${task.value}"]')) {
        alert("Task exists!");
        return false;
    }
        // lisää tehtävä localStorage:n
        localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks")) || "[]", { task: task.value, completed: false }]));

    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    // jos tehtävä on jo olemassa
    tasks.forEach(todo => {
        if (todo.task === task.value) {
            alert("Task exists!");
            task.value = "";
            return;
        }
    });
    
    // luo lista, lisää innerHTML ja liitä ul:ään
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
        <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
    // tyhjä syöte
    task.value = "";
    }
    // säilytä nykyinen tehtävä muutosten seuraamiseksi
    var currentTask = null;

    // nouda nykyinen tehtävä
    function getCurrentTask(event) {
        currentTask = event.value;
    }

    // muokkaa tehtävää ja päivitä localStorage
    function editTask(event) {
        let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
        // tarkista onko tehtäväsyöttö tyhjä
        if (event.value === "") {
            alert("Empty task!");
            event.value = currentTask;
            return;
        }
        // Tehtävä on olemassa
        tasks.forEach(task => {
            if (task.task === event.value) {
                alert("Task exists!");
                event.value = currentTask;
                return;
            }
        });

        // päivitä tehtävä
        tasks.forEach(task => {
            if (task.task === currentTask) {
                task.task = event.value;
            }
        });

        // päivitä localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // tehtävä valmis
    function taskComplete(event) {
        let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
        tasks.forEach(task => {
            if (task.task === event.nextElementSibling.value) {
                task.completed = !task.completed;
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.nextElementSibling.classList.toggle("completed");
    }
    // poista tehtävä listasta ja päivitä localStorage
    function removeTask(event) {
        let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
        tasks.forEach(task => {
            if (task.task === event.parentNode.children[1].value) {
                // poista tehtävä
                tasks.splice(tasks.indexOf(task),1);
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.parentElement.remove();
    }
    // päivitä localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
