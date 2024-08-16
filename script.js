const timerbox = document.querySelector(".timerbox");
const heading = document.querySelector(".startitle");
const startbutton = document.querySelector(".startbutton");
const pausebutton = document.querySelector(".pausebutton");
const resumebutton = document.querySelector(".resumebutton");
const restartbutton = document.querySelector(".restartbutton");

const taskHours = document.querySelector("#taskhours");
const taskMinutes = document.querySelector("#taskminutes");
const taskSeconds = document.querySelector("#taskseconds");
const breakHours = document.querySelector("#breakhours");
const breakMinutes = document.querySelector("#breakminutes");
const breakSeconds = document.querySelector("#breakseconds");

let id_Timer = null;
let OneRC = false;
let total_Count = 0;
let stop = false;

const headerupdate = (message) => {
    heading.textContent = message;
};

const counts = () => {
    let count = JSON.parse(localStorage.getItem("TaskCounts"));
    if (count !== null) {
        count++;
    } else {
        count = 1;
    }
    localStorage.setItem("TaskCounts", JSON.stringify(count));
};

const countstart = (time) => {
    return () => {
        if (time >= 0) {
            const hours = Math.floor(time / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            timerbox.textContent = `${hours}:${minutes}:${seconds}`;
            time--;
        } else {
            Timerstop();
            if (OneRC === false) {
                const breaktime = (parseInt(breakHours.value) || 0) * 3600 + (parseInt(breakMinutes.value) || 0) * 60 + (parseInt(breakSeconds.value) || 0);
                id_Timer = Timerstart(breaktime);
                OneRC = true;
                headerupdate("It's Refresh Time!");
            } else {
                total_Count++;
                // headerupdate(`Great! You've completed ${total_Count} round${total_Count > 1 ? 's' : ''}!`);
                if (total_Count > 1) {
                    headerupdate(`Great! You've completed ${total_Count} rounds!`);
                } else {
                    headerupdate(`Great! You've completed ${total_Count} round!`);
                }
                setTimeout(() => headerupdate("Click Start to Keep Going!"), 2000);
                counts();
                OneRC = false;
            }
        }
    }
};

const Timerstart = (timestart) => {
    if (id_Timer !== null) {
        Timerstop();
    }
    return setInterval(countstart(timestart), 1000);
};

const Timerstop = () => {
    clearInterval(id_Timer);
    id_Timer = null;
};

const getTime_sec = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":");
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

startbutton.addEventListener("click", () => {
    const tasktime = (parseInt(taskHours.value) || 0) * 3600 + (parseInt(taskMinutes.value) || 0) * 60 + (parseInt(taskSeconds.value) || 0);
    id_Timer = Timerstart(tasktime);
    headerupdate("It's Task Time!");
    timerbox.textContent = `${String(taskHours.value).padStart(2, '0')}:${String(taskMinutes.value).padStart(2, '0')}:${String(taskSeconds.value).padStart(2, '0')}`;
});

restartbutton.addEventListener("click", () => {
    Timerstop();
    timerbox.textContent = "00:00:00"; // 1 to 0
    headerupdate("Begin Again by Clicking Start!");
    OneRC = false;
    total_Count = 0;
});

pausebutton.addEventListener("click", () => {
    Timerstop();
    stop = true;
    headerupdate("Taking a Pause!");
});

resumebutton.addEventListener("click", () => {
    if (stop === true) {
        const C_Time = getTime_sec(timerbox.textContent);
        id_Timer = Timerstart(C_Time);
        stop = false;
        // headerupdate(OneRC ? "It's Refresh Time!" : "It's Task Time!");
        if (OneRC) {
            headerupdate("It's Refresh Time!");
        } else {
            headerupdate("It's Task Time!");
        }
    }
});
