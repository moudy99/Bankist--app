const remember = document.querySelector("#remember_me");
const form = document.querySelector("form");
// const user_name = document.querySelector(
//   `input[ placeholder="Enter username" ]`
// );
const register_username = document.querySelector(
  ` .create-account input[ placeholder="username" ]`
);
const login_username = document.querySelector(
  ` .login-form input[placeholder=" username"]`
);
const full_name = document.querySelector(
  `.create-account input[ placeholder="Full Name" ]`
);
const register_pin = document.querySelector(
  `.create-account input[type="password"]`
);
const login_pin = document.querySelector(`.login-form input[type="password"]`);
const email = document.querySelector(
  `.create-account input[  placeholder="Email" ]`
);
const section = document.querySelector("section");
const active_btn = document.querySelector(".active-btn");
const login_btn = document.querySelector(".login");
const register = document.querySelector(".register");
const login_form = document.querySelector(".login-form");
const create_account = document.querySelector(".create-account");
const welcome_message = document.querySelector(".welcome_message");
const media_queries = window.matchMedia("(max-width: 768px)");
const error_message = document.querySelector(".error-message");
const error_message_content = document.querySelector(".error-message .message");
const close_error_message = document.querySelector(".error-message button");

const login = () => {
  active_btn.style.borderRadius = "0px 15px 15px 0";
  create_account.style.display = "none";
  login_form.style.display = "block";
};

const register_fun = () => {
  create_account.style.display = "block";
  login_form.style.display = "none";
  active_btn.style.borderRadius = "15px 0 0 15px";
};

login_btn.addEventListener("click", () => {
  login();
  active_btn.style.width = "100px";
  active_btn.style.transform = "translateX(0%)";
});

register.addEventListener("click", () => {
  register_fun();
  active_btn.style.width = "200px";
  active_btn.style.transform = "translateX(74%)";
});

if (media_queries.matches) {
  login_btn.addEventListener("click", () => {
    login();
    active_btn.style.width = "70px";
    active_btn.style.transform = "translateX(0%)";
  });

  register.addEventListener("click", () => {
    register_fun();
    active_btn.style.width = "140px";
    active_btn.style.transform = "translateX(54%)";
    console.log("Match");
  });
}

function get_data() {
  const data = localStorage.getItem("Accounts");
  if (data) return JSON.parse(data);
  else return [];
}

const number_of_users = get_data().length + 1;

// console.log(number_of_users);

full_name.addEventListener("input", function () {
  const full_name = this.value;
  const words = full_name.split(" ");
  const username = words.map((word) => word.charAt(0).toLowerCase()).join("");
  register_username.value = username + number_of_users;
});

let close_time;

const wrong_account = function () {
  section.style.display = "none";

  error_message.style.display = "flex";
  close_time = setTimeout(() => {
    error_message.style.display = "none";
    section.style.display = "flex";
    login_username.value = "";
    login_pin.value = "";
  }, 3000);
};

close_error_message.addEventListener("click", () => {
  section.style.display = "flex";
  error_message.style.display = "none";
  login_username.value = "";
  login_pin.value = "";
  clearTimeout(close_time);
});

function set_local_storage() {
  const data = get_data();

  const new_account = {
    owner: full_name.value,
    pin: register_pin.value,
    email: email.value,
    username: register_username.value,
    movements: [],
    movements_date: [],
  };

  data.push(new_account);
  console.log(data);
  localStorage.setItem("Accounts", JSON.stringify(data));
}

create_account.addEventListener("submit", (e) => {
  // e.preventDefault();
  set_local_storage();
  sessionStorage.setItem("login--user", register_username.value);
  sessionStorage.setItem("login--pin", register_pin.value);
  register_pin.value = "";
  email.value = "";
  full_name.value = "";
  register_username.value = "";
});

login_form.addEventListener("submit", (e) => {
  const all_accounts = get_data();
  console.log(all_accounts);
  if (
    all_accounts.some((acc) => acc.username === login_username.value) &&
    all_accounts.some((acc) => acc.pin === login_pin.value)
  ) {
    if (remember.checked) {
      localStorage.setItem("remember-user", login_username.value);
      localStorage.setItem("remember-pin", login_pin.value);
    } else {
      localStorage.removeItem("remember-user");
      localStorage.removeItem("remember-pin");
    }
    sessionStorage.setItem("login--user", login_username.value);
    sessionStorage.setItem("login--pin", login_pin.value);
    e.submit();
  } else {
    e.preventDefault();

    wrong_account();
  }
});

if (
  localStorage.getItem("remember-user") != null ||
  localStorage.getItem("remember-pin") != null
) {
  login_username.value = localStorage.getItem("remember-user");
  login_pin.value = localStorage.getItem("remember-pin");
}

// function preventBack() {
//   window.history.forward();
// }
// setTimeout("preventBack()", 0);
// window.onunload = function () {
//   null;
// };

// !==================

console.log(new Date().toISOString());
