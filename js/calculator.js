window.onload = function() {
    updateNeutrophil();
    recalculateResult();
}

$(document).ready(function(){
    $(this).scrollTop(0);
});

document.getElementById("neutrophil").oninput = function() {
    updateNeutrophil();
}

function updateNeutrophil() {
    rangeInput= document.getElementById("neutrophil");
    percent=(rangeInput.value-rangeInput.min)/(rangeInput.max-rangeInput.min)*100;
    rangeInput.style.background = 'linear-gradient(to right, #277296 0%, #277296 ' + percent + '%, #fff ' + percent + '%, #707070 37%)';

    document.getElementById("neutrophilCount").innerHTML = document.getElementById("neutrophil").value;
    recalculateResult();
}

// Factors
const RESULT_BASE = 1.703;
const GENDER_MALE_COEF = -0.218;
const HYDRONEPHROSIS_COEF = -0.239;
const HYDROURETER_COEF = 0.262;
const TEMPERATURE_COEF = 0.31387545388584;
const NEUTROPHILS_COEF = 0.026;

const  STONE_SIZE_SMALL_COEF = 0;
const  STONE_SIZE_MEDIUM_COEF = -1.609;
const  STONE_SIZE_BIG_COEF = -2.221;

const  STONE_POSITION_LOWER_COEF = 0;
const  STONE_POSITION_MIDDLE_COEF = -0.542;
const  STONE_POSITION_UPPER_COEF = -1.175;

// For all calculator input buttons, recalculate result when clicked.
var gender;
var neutrophil;
var hydroureter;
var hydronephrosis;
var highTemp;
var stoneSize;
var stonePos;

var gender_factor;
var neutrophil_factor;
var hydroureter_factor;
var hydronephrosis_factor;
var highTemp_factor;
var stoneSize_factor;
var stonePos_factor;

$('.calcInput').click(function(e) {
    recalculateResult();
});

function recalculateResult() {
    retrieveLatestInputs();
    showResult(calcResult());
}

function retrieveLatestInputs() {
    gender = document.querySelector('input[name="gender"]:checked').value;
    neutrophil = document.getElementById("neutrophil").value;
    hydroureter = document.querySelector('input[name="hydroureter"]:checked').value;
    hydronephrosis = document.querySelector('input[name="hydronephrosis"]:checked').value;
    highTemp = document.querySelector('input[name="highTemp"]:checked').value;
    stoneSize = document.querySelector('input[name="stoneSize"]:checked').value;
    stonePos = document.querySelector('input[name="stonePos"]:checked').value;
}

function calcResult() {
    gender_factor = (gender == "male") ? GENDER_MALE_COEF : 0;
    neutrophil_factor = neutrophil * NEUTROPHILS_COEF;
    hydroureter_factor = (hydroureter == "hydroureterTrue") ? (HYDROURETER_COEF) : (0);
    hydronephrosis_factor = (hydronephrosis == "hydronephrosisTrue") ? (HYDRONEPHROSIS_COEF) : 0;
    highTemp_factor = (highTemp == "highTempTrue") ? (TEMPERATURE_COEF) : (0);
    stoneSize_factor = (stoneSize == "stoneSizeSmall") ? (STONE_SIZE_SMALL_COEF) : ((stoneSize == "stoneSizeMedium") ? (STONE_SIZE_MEDIUM_COEF) : (STONE_SIZE_BIG_COEF));
    stonePos_factor = (stonePos == "stonePosLow") ? (STONE_POSITION_LOWER_COEF) : ((stonePos == "stonePosMiddle") ? (STONE_POSITION_MIDDLE_COEF) : (STONE_POSITION_UPPER_COEF));

    var xBeta = RESULT_BASE + gender_factor + neutrophil_factor + hydroureter_factor + hydronephrosis_factor + highTemp_factor + stoneSize_factor + stonePos_factor;
    var expXBeta = parseFloat(Math.exp(xBeta));
    var result = (expXBeta / (1+expXBeta)) * 100;
    if (result < 20) {
      return "< 20%";
    }
    return Math.round(result) + "%";
}

function showResult(result) {
    document.getElementById("result").innerHTML = result;
}

function radioClicked(radioId) {
        document.getElementById(radioId).checked = true;
        recalculateResult();
}

// Behavior of the pop-up info box.
var infoBox = document.getElementById("infoBox");
var infoBoxHeader = document.getElementById("infoHeader")
var infoBoxContent = document.getElementById("infoContent")
var calculatorSection = document.getElementById("calculatorContainer");

window.onclick = function(event) {
  if (event.target == infoBox) {
    hideInfoBox();
  }
}

function showInfoBox() {
  calculatorSection.style.filter="blur(2px)";
  infoBox.style.display = "inline-block";
}

function hideInfoBox() {
  calculatorSection.style.filter="blur(0px)";
  infoBox.style.display = "none";
}


function helpHydroureter() {
  infoBoxHeader.innerHTML = "Hydroureter";
  infoContent.innerHTML = "Abnormal dilatation of the ureter<br/>with urine";
  showInfoBox();
}

function helpHydronephrosis() {
  infoBoxHeader.innerHTML = "Hydronephrosis";
  infoContent.innerHTML = "Dilation of the renal pelvis and<br/>calyces due to urine flow obstruction";
  showInfoBox();
}


function helpTemperature() {
  infoBoxHeader.innerHTML = "High Temperature";
  infoContent.innerHTML = "Temperature ≥ 38.0 °C ";
  showInfoBox();
}


function helpStonePosition() {
  infoBoxHeader.innerHTML = "Stone Position";
  infoContent.innerHTML = "<b>Lower Ureter</b>- below the sacrum to the vesico-ureteric junction<br/><b>Middle Ureter</b>- from top to bottom of sacrum<br/><b>Upper Ureter</b>- from renal pelvis to top of sacrum";
  showInfoBox();
}
