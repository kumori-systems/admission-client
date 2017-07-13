"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deferred {
    constructor() {
        this.state = "pending";
        this.fate = "unresolved";
        this.promise = new Promise((resolve, reject) => {
            this.xresolve = resolve;
            this.xreject = reject;
        });
        this.promise.then(() => this.state = "fulfilled", () => this.state = "rejected");
    }
    resolve(value) {
        if (this.fate === "resolved") {
            throw new Error("Deferred cannot be resolved twice");
        }
        this.fate = "resolved";
        this.xresolve(value);
    }
    reject(reason) {
        if (this.fate === "resolved") {
            throw new Error("Deferred cannot be resolved twice");
        }
        this.fate = "resolved";
        this.xreject(reason);
    }
    isResolved() {
        return this.fate === "resolved";
    }
    isPending() {
        return this.state === "pending";
    }
    isFulfilled() {
        return this.state === "fulfilled";
    }
    isRejected() {
        return this.state === "rejected";
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.js.map