"use strict";

const accounts = JSON.parse(localStorage.getItem("Accounts"));
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value--in");
const labelSumOut = document.querySelector(".summary-value--out");
// const labelSumInterest = document.querySelector(".summary-value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form-btn--transfer");
const btn_deposit = document.querySelector(".form-btn--deposit");
const btn_withdraw = document.querySelector(".form-btn--withdraw");
const btnClose = document.querySelector(".form-btn--close");
const btnSort = document.querySelector(".btn--sort");
const logout_btn = document.querySelector(".logout");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form-input--to");
const inputTransferAmount = document.querySelector(".form-input--amount");
const input_depositAmount = document.querySelector(
  ".form-input--deposit-amount"
);
const input_withdrawAmount = document.querySelector(
  ".form-input--withdraw-amount"
);
const inputCloseUsername = document.querySelector(".form-input--user");
const inputClosePin = document.querySelector(".form-input--pin");

const login_user = sessionStorage.getItem("login--user");
const login_pin = sessionStorage.getItem("login--pin");
const current_account = accounts.find((acc) => acc.username === login_user);

console.log(current_account);
console.log("Current Account");

// ! ------------- Dates -->

setInterval(() => {
  labelDate.textContent = new Date().toLocaleString();
}, 1000);
let move_date = new Date();

const format_date = function (date) {
  const days_passed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const passed_day = days_passed(new Date(), date);

  if (passed_day === 0) return "Today";
  if (passed_day === 1) return "Yesterday";
  if (passed_day <= 7) return `${passed_day} days ago`;
  return new Date(date).toLocaleDateString();
};

// ! ------------- Display Movements -->
const display_movement = function (currentAccount, sort = false) {
  const movements = currentAccount.movements;
  const moves = sort ? movements.slice(" ").sort((a, b) => a - b) : movements;
  console.log(movements);
  containerMovements.innerHTML = "";

  moves.forEach((mov, i) => {
    const move_date = format_date(new Date(currentAccount.movements_date[i]));

    const html = `
    <div class="movements-box">
    <div class="type-of-movement type-of-movement--${
      mov > 0 ? "deposit" : "withdrawal"
    }">
      ${i + 1} ${mov > 0 ? "deposit" : "withdrawal"}
    </div>
    <div class="date-of-movement">${move_date}</div>
    <div class="value-of-movement">${Math.abs(mov)}$</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
  const total_in = movements
    .filter((mov) => mov > 0)
    .reduce((acu, mov) => acu + mov);

  const total_out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const balance = movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${balance}$`;
  labelSumIn.textContent = `${total_in}$`;
  labelSumOut.textContent = `${total_out}$`;
};

if (current_account.movements.length > 0) {
  display_movement(current_account);
}

// ! ------------- Welcome Message -->

const welcome = function (current_account) {
  const name = current_account.owner
    .split(" ")
    .map((word) => word.toUpperCase());

  document.querySelector(".user-name").textContent = name[0];
};

welcome(current_account);

// ! ------------- deposit money -->
const deposit_money = function () {
  const amount = Number(input_depositAmount.value);
  if (amount <= 0) {
    alert("Enter Valid Number...");
    return;
  }
  current_account.movements.push(amount);
  current_account.movements_date.push(move_date);
  localStorage.setItem("Accounts", JSON.stringify(accounts));
};

btn_deposit.addEventListener("click", (e) => {
  e.preventDefault();
  deposit_money();
  input_depositAmount.value = "";
  display_movement(current_account);
});

// ! ------------- withdraw money -->

const withdraw_money = function () {
  const amount = Number(input_withdrawAmount.value);
  if (amount > Number(parseInt(labelBalance.textContent)) || amount <= 0) {
    alert("Enter Valid Number...");
    return;
  }
  current_account.movements.push(-amount);
  current_account.movements_date.push(move_date);

  localStorage.setItem("Accounts", JSON.stringify(accounts));
};

btn_withdraw.addEventListener("click", (e) => {
  e.preventDefault();
  withdraw_money();
  input_withdrawAmount.value = "";
  display_movement(current_account);
});

// ! ------------- transfer money -->

const transfer_money = function () {
  const transfer_to = inputTransferTo.value;
  const account_to = accounts.find((acc) => acc.username === transfer_to);
  const amount = Number(inputTransferAmount.value);
  if (
    amount > Number(parseInt(labelBalance.textContent)) ||
    amount <= 0 ||
    !account_to
  ) {
    console.log(account_to);
    alert("The user you try transfer to not found Or invalid amount..");
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    return;
  }
  current_account.movements.push(-amount);
  current_account.movements_date.push(move_date);

  account_to.movements.push(amount);
  account_to.movements_date.push(move_date);

  localStorage.setItem("Accounts", JSON.stringify(accounts));
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
};

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  transfer_money();
  display_movement(current_account);
});

// ! ------------- Delete account -->

const delete_account = function () {
  const close_user = inputCloseUsername.value;
  const close_pin = Number(inputClosePin.value);

  if (
    close_user != current_account.username ||
    close_pin != current_account.pin
  ) {
    alert("Enter your current user and pin ..");
    inputClosePin.value = "";
    inputCloseUsername.value = "";
    return;
  }
  if (window.confirm("You will close you account")) {
    const index = accounts.findIndex((acc) => acc.username === close_user);
    accounts.splice(index, 1);
    localStorage.setItem("Accounts", JSON.stringify(accounts));
    sessionStorage.clear();
    window.open("../index.html", "_self");
  } else {
    inputClosePin.value = "";
    inputCloseUsername.value = "";
  }
  console.log(accounts);
};

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  delete_account();
});

// ! ------------- Sorting -->
let sorting = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  display_movement(current_account, !sorting);
  sorting = !sorting;
});

// ! ------------- Logout -->

logout_btn.addEventListener("click", () => {
  sessionStorage.clear();
  window.open("../index.html", "_self");
});

// ! ------------- Logout timer -->
const logout_timer = function () {
  const timer_counter = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      window.open("../index.html", "_self");
    }

    time--;
  };

  let time = 120;

  timer_counter();
  const timer = setInterval(timer_counter, 1000);

  return timer;
};
logout_timer();
// ////////////////////////////////////
function preventBack() {
  window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () {
  null;
};
