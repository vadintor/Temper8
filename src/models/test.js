"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var Test = /** @class */ (function () {
    // private static source = Observable.interval(1000).map( (x) => {
    //         if (x < 10) {
    //             return { value: x, date: 1111 };
    //         } else if (x < 20) {
    //             return { value: 10, date: 2222 };
    //         } else {
    //             return { value: x, date: 3333 };
    //         }
    // });
    // private static u = Observable.create(()=> { console.log('created');} );
    // private subject = new Subject();
    // private refCounted = Test.u.multicast(this.subject).refCount();
    // subscription1: Subscription;
    // subscription2: Subscription;
    // subscriptionConnect: Subscription;
    function Test() {
        this.O = new rxjs_1.Observable();
        this.L = new rxjs_1.Subject();
        this.R = this.O.multicast(this.L).refCount();
        this.B = new rxjs_1.BehaviorSubject({ value: -85, date: 1234556 });
        console.log('B.getValue(): ', this.B.getValue());
        this.init();
    }
    Test.prototype.init = function () {
        var s = this.B.asObservable();
        s.subscribe(function (v) { return console.log('observer l: ', v); });
        // console.log('L: ', this.L);
        // console.log('R: ', this.R);
        // console.log('l: ', this.l);
        this.B.next({ value: 1, date: 1 });
        console.log('---');
        this.B.next({ value: 0, date: 1 });
        // const data = { value: 20, date: 3333 };
        // console.log('observerA subscribed');
        // this.subscription1 = this.refCounted.distinctUntilChanged((p: T, q: T) => p.value === q.value).subscribe({
        // next: (v: T) => console.log('observerA: ', JSON.stringify(v)),
        // });
        // setTimeout(() => {
        // console.log('observerB subscribed');
        // this.subscription2 = this.refCounted.subscribe({
        //     next: (v: T) => console.log('observerB: ', JSON.stringify(v)),
        // });
        // }, 5000);
        // this.subject.next(data);
        // setTimeout(() => {
        // console.log('observerA unsubscribed');
        // subscription1.unsubscribe();
        // }, 1200);
        // // This is when the shared Observable execution will stop, because
        // // `refCounted` would have no more subscribers after this
        // setTimeout(() => {
        // console.log('observerB unsubscribed');
        // this.subscription2.unsubscribe();
        // }, 2000);
    };
    return Test;
}());
exports.Test = Test;
var T = new Test();
