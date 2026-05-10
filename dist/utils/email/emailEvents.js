"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = exports.Email = void 0;
const events_1 = require("events");
const sendEmail_1 = require("./sendEmail");
const generateHtml_1 = require("./generateHtml");
const emailEmitter = new events_1.EventEmitter();
class Email {
    emitter;
    constructor(emitter) {
        this.emitter = emitter;
    }
    publish(eventName, ...args) {
        this.emitter.emit(eventName, ...args);
    }
    subscribe(eventName, listener) {
        this.emitter.on(eventName, listener);
    }
}
exports.Email = Email;
exports.emailEvent = new Email(emailEmitter);
exports.emailEvent.subscribe("confirm-email", async ({ to, title, otp, subject, expiredTime }) => {
    const html = (0, generateHtml_1.generateHtml)(title, otp, expiredTime);
    (0, sendEmail_1.sendEmail)({ to, subject, html });
});
