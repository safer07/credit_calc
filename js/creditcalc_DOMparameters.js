import { percentFormatter } from "./creditcalc_formatters.js";
import { values } from "./creditcalc_initValues.js";

// Ставки по программе
const programBase = values.programRate.base;
const programIt = values.programRate.it;
const programGov = values.programRate.gov;
const programZero = values.programRate.zero;

document.querySelector("#base-value").value = programBase;
document.querySelector("#it-value").value = programIt;
document.querySelector("#gov-value").value = programGov;
document.querySelector("#zero-value").value = programZero;

// Указываем ставки по программе в label
document.querySelector("label[for='base-value'] span").innerText =
  percentFormatter.format(programBase);
document.querySelector("label[for='it-value'] span").innerText =
  percentFormatter.format(programIt);
document.querySelector("label[for='gov-value'] span").innerText =
  percentFormatter.format(programGov);
document.querySelector("label[for='zero-value'] span").innerText =
  percentFormatter.format(programZero);

// Отображение выбранной процентной ставки
const programInputs = document.querySelectorAll('input[name="program"]');
const totalPercent = document.querySelector("#total-percent");

programInputs.forEach((input) => {
  // Ставка при загрузке
  if (input.checked)
    totalPercent.innerText = percentFormatter.format(input.value);

  // Ставка при переключении
  input.addEventListener("click", function () {
    totalPercent.innerText = percentFormatter.format(this.value);
  });
});

// Указываем значения в форме
document.querySelector("#min-cost").innerText = values.cost.labelMin;
document.querySelector("#medium-cost").innerText = values.cost.labelMedium;
document.querySelector("#max-cost").innerText = values.cost.labelMax;
document.querySelector("#min-downpayment-rate").innerText =
  values.downpayment.labelMin;
document.querySelector("#max-downpayment-rate").innerText =
  values.downpayment.labelMax;
document.querySelector("#min-term").innerText = values.term.labelMin;
document.querySelector("#max-term").innerText = values.term.labelMax;
