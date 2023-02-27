const btnSubmit = document.querySelector(".btn-submit");
const state = document.getElementById("state");
const weight = document.querySelector(".weight");
const userName = document.getElementById("userName");
const info = document.querySelector(".liter");
const workHour = document.querySelector(".workHour");
const setHour = document.querySelector(".setHour");
const weakUpTime = document.querySelector("#weakup");
const sleepTime = document.querySelector("#sleep");
const fastTimeShow = document.querySelector(".fast-time");
const showAmountMili = document.querySelector(".show-amount");
const totallyAmount = document.querySelector(".tatally-amount");
const countDownT = document.querySelector(".countdown-time");
const btnDone = document.querySelector(".btn-done");
const alretSection = document.querySelector(".alret-section");
const voice = document.querySelector(".voice");
const drinkedAmount = document.querySelector(".drink-amount");
info.innerHTML = "";

//userful variable
let normalAmountMili,
  workTime,
  usersetTime,
  wholeDaymili,
  actTimeAmount,
  sleepH,
  partTimeAnoumt;

//calc for other people=======================
const dependLife = (state, noraml, workHour) => {
  if (state === "Pregnant") return 101.44;
  if (state === "Aircon") return noraml;
  if (state === "heat" || state === "Gym" || state === "sun")
    return noraml + (workHour / 30) * 12;
};

//calc for militer for one hour=========
const calcMili = () => {
  partTimeAnoumt = wholeDaymili * (usersetTime / actTimeAmount);
  console.log(partTimeAnoumt);

  showAmountMili.textContent = `${Math.trunc(partTimeAnoumt)} ml`;
};

//calc for fast time background white #fff
let day;
const showUserDrinkTime = (curretnTime) => {
  const afterVal = curretnTime + usersetTime * 60 * 60 * 1000;
  const fastTime = new Date(afterVal);
  let fastH = fastTime.getHours();
  let fastM = fastTime.getMinutes();

  if (fastH > 12) {
    fastH -= 12;
  }

  //for pm or am
  if (fastH >= 12) {
    day = "PM";
  } else {
    day = "AM";
  }

  fastTimeShow.textContent = `${fastH} : ${fastM} ${day}`;
};

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  usersetTime = Number(setHour.value);
  const userCondition = state.value;
  const userWeight = Number(weight.value);
  const name = userName.value;
  workTime = Number(workHour.value * 60);

  //normal amount
  normalAmount = Number(userWeight) * 0.5;

  //according to user lifestyle
  const finalAmount = dependLife(userCondition, normalAmount, workTime);
  const liters = finalAmount / 33.81;
  wholeDaymili = Math.trunc(liters * 1000);

  //displ drinking water amount for user=====================

  info.style.display = "block";
  info.textContent = `Hey ${name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")} ! You need to drink ${liters.toFixed(2)} liters (${(
    liters * 1000
  ).toFixed(2)})ml in a day`;

  //calc time different weakup time and sleep time
  const [weakH] = weakUpTime.value.split(":");
  [sleepH] = sleepTime.value.split(":");
  actTimeAmount = sleepH - weakH;
  console.log(actTimeAmount, sleepH, Number(sleepH));

  //show user drink time
  const currentTime = new Date().getTime();
  showUserDrinkTime(currentTime);

  //part time amount show by mili
  calcMili();

  //coundown timer
  startTimer(usersetTime * 60 * 60); //truecode
  //startTimer(60); //testcode

  //totallyAmount show
  totallyAmount.textContent = `${wholeDaymili}ml`;
});

// calc for countdown timer
let setTimerInter;
function startTimer(duration) {
  let timer = duration,
    hours,
    minutes,
    seconds;
  setTimerInter = setInterval(function () {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer - hours * 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    countDownT.textContent = `${hours} : ${minutes} : ${seconds}`;

    if (--timer < 0) {
      clearInterval(setTimerInter);
      alretSection.style.display = "block";

      // alret 2 time
      let a = 0;
      do {
        a += 1;
        voice.play();
      } while (a < 2);
    }
  }, 1000);
}

btnDone.addEventListener("click", () => {
  const curren = new Date();
  cTime = curren.getHours();

  if (cTime < Number(sleepH)) {
    alretSection.style.display = "none";

    //for voice alarm
    voice.pause();

    //coundown timer
    startTimer(usersetTime * 60 * 60);

    //show user drink time
    const currentTime = new Date().getTime();
    showUserDrinkTime(currentTime);

    let drinked = 0;
    drinked += Math.trunc(partTimeAnoumt);

    drinkedAmount.textContent = `${drinked}ml`;
  }
});

// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();
