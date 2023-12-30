import {
  priceFormatter,
  priceFormatterDecimals,
} from "./creditcalc_formatters.js";
import { values } from "./creditcalc_initValues.js";

const costValue = values.cost.defaultValue;
const minCost = values.cost.min;
const maxCost = values.cost.max;
let downpaymentValue = values.downpayment.defaultValue;
let minDownpayment, maxDownpayment;
const minDownpaymentRate = values.downpayment.minRate;
const maxDownpaymentRate = values.downpayment.maxRate;
const defaultTerm = values.term.defaultValue;
const minTerm = values.term.min;
const maxTerm = values.term.max;

const inputCost = document.querySelector("#input-cost");
const inputDownpayment = document.querySelector("#input-downpayment");
const inputTerm = document.querySelector("#input-term");

const form = document.querySelector("#form");
const totalCost = document.querySelector("#total-cost");
const totalMonthPayment = document.querySelector("#total-month-payment");

const cleavePriceSetting = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  delimiter: " ",
};

const cleaveCost = new Cleave(inputCost, cleavePriceSetting);
const cleaveDownpayment = new Cleave(inputDownpayment, cleavePriceSetting);

const sliderCost = document.querySelector("#slider-cost");
const sliderDownpayment = document.querySelector("#slider-downpayment");

// Вывод при загрузке
cleaveCost.setRawValue(costValue);
cleaveDownpayment.setRawValue(downpaymentValue);
inputTerm.value = defaultTerm;
calcMortgage();

// Отображение и рассчёт суммы кредита
form.addEventListener("input", calcMortgage);

function calcMortgage() {
  // Проверка, чтобы сумма не превышала максимальное значение
  let cost = +cleaveCost.getRawValue();
  if (+cleaveCost.getRawValue() > maxCost) cost = maxCost;

  // Общая сумма кредита
  const totalAmount = cost - +cleaveDownpayment.getRawValue();
  totalCost.innerText = priceFormatter.format(totalAmount);

  // Ставка по кредиту
  const creditRate = +document.querySelector('input[name="program"]:checked')
    .value;
  const monthRate = creditRate / 12;

  const years = +document.querySelector("#input-term").value;
  const months = years * 12;

  // Рассчёт ежемесячного платежа
  const monthPayment =
    (totalAmount * monthRate) / (1 - (1 + monthRate) ** -months);
  totalMonthPayment.innerText = priceFormatterDecimals.format(monthPayment);
}

// Slider Cost
noUiSlider.create(sliderCost, {
  start: costValue,
  connect: "lower",
  // tooltips: true,
  step: values.cost.stepLow,
  range: {
    min: values.cost.min,
    "50%": [values.cost.medium, values.cost.stepHigh],
    max: maxCost,
  },
});

sliderCost.noUiSlider.on("slide", () => {
  const sliderValue = parseInt(sliderCost.noUiSlider.get());
  inputCost.value = sliderValue;

  cleaveCost.setRawValue(sliderValue);
  updateSliderDownpayment(sliderValue);
  calcMortgage();
});

// Обновление Slider Downpayment в зависимости от Slider Cost
sliderCost.noUiSlider.on("set", () => {
  const sliderValue = sliderCost.noUiSlider.get();
  updateSliderDownpayment(sliderValue);
});

// Slider Downpayment
noUiSlider.create(sliderDownpayment, {
  start: downpaymentValue,
  connect: "lower",
  step: values.downpayment.step,
  range: {
    min: 400000,
    max: 100000000,
  },
});

updateSliderDownpayment(costValue);

sliderDownpayment.noUiSlider.on("slide", () => {
  downpaymentValue = parseInt(sliderDownpayment.noUiSlider.get());
  inputDownpayment.value = downpaymentValue;

  cleaveDownpayment.setRawValue(downpaymentValue);
  validateDownpaymentValue();
  calcMortgage();
});

// Slider Term
const sliderTerm = document.querySelector("#slider-term");

noUiSlider.create(sliderTerm, {
  start: defaultTerm,
  connect: "lower",
  step: values.term.step,
  range: {
    min: values.term.min,
    max: values.term.max,
  },
});

sliderTerm.noUiSlider.on("slide", () => {
  const sliderValue = parseInt(sliderTerm.noUiSlider.get());
  inputTerm.value = sliderValue;

  validateInputValue(inputTerm, sliderValue, minTerm, maxTerm);
  calcMortgage();
});

// Форматирование inputCost
inputCost.addEventListener("input", () => {
  const value = +cleaveCost.getRawValue();

  // Обновление range slider
  sliderCost.noUiSlider.set(value);

  // Проверка интервала допустимого значения
  validateInputValue(inputCost, value, minCost, maxCost);

  updateSliderDownpayment(value);
});

inputCost.addEventListener("change", () => {
  let value = +cleaveCost.getRawValue();

  if (value > maxCost) {
    inputCost.closest(".param-details").removeAttribute("style");
    cleaveCost.setRawValue(maxCost);
    value = maxCost;
  }

  updateSliderDownpayment(value);
});

// Форматирование inputDownpayment
inputDownpayment.addEventListener("input", () => {
  const value = +cleaveDownpayment.getRawValue();
  downpaymentValue = value;

  // Обновление range slider
  sliderDownpayment.noUiSlider.set(value);

  // Проверка интервала допустимого значения
  validateDownpaymentValue();
});

// Форматирование inputTerm
inputTerm.addEventListener("input", () => {
  const value = inputTerm.value;

  // Обновление range slider
  sliderTerm.noUiSlider.set(value);

  // Проверка интервала допустимого значения
  validateInputValue(inputTerm, value, minTerm, maxTerm);
});

function updateSliderDownpayment(value) {
  // Обновлять downPayment в зависимости от inputCost
  minDownpayment = value * minDownpaymentRate;
  maxDownpayment = value * maxDownpaymentRate;

  sliderDownpayment.noUiSlider.updateOptions({
    range: {
      min: minDownpayment,
      max: maxDownpayment,
    },
  });

  // Обновление range slider
  sliderDownpayment.noUiSlider.set(downpaymentValue);

  // Проверка интервала допустимого значения
  validateDownpaymentValue();
}

function validateInputValue(input, value, minValue, maxValue) {
  if (value < minValue || value > maxValue) showInputError(input);
  else hideInputError(input);
}

function validateDownpaymentValue() {
  validateInputValue(
    inputDownpayment,
    downpaymentValue,
    minDownpayment,
    maxDownpayment,
  );
}

function showInputError(input) {
  input.closest(".param-details").style.borderColor = "#dc2626";
  input.closest(".param-details").style.backgroundColor = "#fee2e2";
}

function hideInputError(input) {
  input.closest(".param-details").removeAttribute("style");
}
