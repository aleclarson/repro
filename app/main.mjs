import { default as esmPackage, cjs as cjsPackage } from "esm-package";

document.body.textContent = JSON.stringify({ esmPackage, cjsPackage });
