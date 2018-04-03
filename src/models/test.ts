import { BehaviorSubject, Observable, Subject  } from 'rxjs';
// import { Scheduler } from 'rxjs/Scheduler';
interface T {
    value: number;
    date: number;
}


export class Test {
    private O: Observable<T> = new Observable<T> ();
    private L = new Subject<T>();
    private R = this.O.multicast(this.L).refCount();

    private B: BehaviorSubject<T>;
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

    constructor() {
        this.B = new BehaviorSubject<T>({value:-85, date: 1234556});
        console.log('B.getValue(): ', this.B.getValue());
        this.init();
    }

    private init(): void {

        const s = this.B.asObservable();
        s.subscribe((v: T) => console.log('observer l: ', v));

        // console.log('L: ', this.L);
        // console.log('R: ', this.R);
        // console.log('l: ', this.l);
        this.B.next({value: 1, date: 1});
        console.log('---');
        this.B.next({value: 0, date: 1});

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

    }
}
const T = new Test();
