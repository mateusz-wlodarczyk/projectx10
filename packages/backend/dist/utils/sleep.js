"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
function sleep(delayMS) {
    return new Promise((resolve) => setTimeout(resolve, delayMS));
}
