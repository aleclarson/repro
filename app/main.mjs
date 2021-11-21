import upper from "cjs-package";
import Datetime from "react-datetime";

document.querySelector("#import-default").textContent =
  typeof upper === "function"
    ? upper("The quick brown fox jumped over the lazy dog")
    : `Tried to use upper(), but it was type ${typeof upper}`;

document.querySelector("#react-datetime-type").textContent = typeof Datetime;
