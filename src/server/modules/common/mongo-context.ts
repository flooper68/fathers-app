// import PromiseQueue from 'promise-queue';
// import { model, Model, Schema } from 'mongoose';

// import { assertExistence } from './assert-existence';
// import { Logger } from '../../../shared/logger';
// import { rest } from 'lodash';
// import { Subject } from 'rxjs';
// import { v4 } from 'uuid';
// import _ from 'lodash';
// import e from 'express';

// export interface BaseDocument<S extends { uuid: string }> extends Document {
//   schemaVersion: number;

//   startEventPosition: number;
//   endEventPosition: number;
//   position: number;
//   dataVersion: number;

//   uuid: string;
//   state: S;

//   events: unknown[];
//   outbox: unknown[];
// }

// interface AggregateRoot<S extends { uuid: string }> {
//   getState(): S;
//   getEvents(): any[];
// }

// export interface AggregateFactory<S, R> {
//   hydrate(state: S, lastPosition: number): R;
// }

// class ConcurrencyError extends Error {
//   code = 'ConcurrencyError';
// }

// export class Repository<S extends { uuid: string }, R> {
//   _fetchedDocument: BaseDocument<S> | null = null;

//   constructor(
//     private readonly model: Model<BaseDocument<S>>,
//     private readonly schemaVersion: number,
//     private readonly eventCountLimit: number,
//     private readonly factory: AggregateFactory<S, R>
//   ) {}

//   private async createNewBucket(state: S) {
//     Logger.info(`Creating first bucket for new entity`);
//     const result = await this.model.updateOne(
//       { _id: `${state.uuid}_${0}` },
//       {
//         $setOnInsert: {
//           _id: `${state.uuid}_${0}`,
//           schemaVersion: this.schemaVersion,
//           startEventPosition: 0,
//           endEventPosition: 0,
//           dataVersion: 0,
//           position: 0,
//           uuid: state.uuid,
//           events: [],
//           outbox: [],
//         },
//       },
//       { upsert: true }
//     );

//     if (!result.upserted) {
//       throw new Error(`Entity already exists`);
//     }

//     this._fetchedDocument = await this.model.findOne({
//       _id: `${state.uuid}_${0}`,
//     });
//   }

//   private async handleBucketSize(state: S) {
//     const document = assertExistence(this._fetchedDocument);

//     if (
//       document.endEventPosition - document.startEventPosition >=
//       this.eventCountLimit
//     ) {
//       Logger.info(
//         `Over the event limit ${document.startEventPosition} ${document.endEventPosition}, creating new bucket`
//       );
//       const result = await this.model.updateOne(
//         {
//           _id: `${state.uuid}_${document.position + 1}`,
//         },
//         {
//           $setOnInsert: {
//             _id: `${state.uuid}_${document.position + 1}`,
//             schemaVersion: this.schemaVersion,
//             startEventPosition: document.endEventPosition,
//             endEventPosition: document.endEventPosition,
//             position: document.position + 1,
//             uuid: state.uuid,
//             state: document.state as any,
//             dataVersion: 0,
//             events: [],
//             outbox: [],
//           },
//         },
//         { upsert: true }
//       );

//       if (!result.upserted) {
//         Logger.info(
//           `New bucket created with starPosition ${document.endEventPosition}`
//         );
//       }

//       throw new ConcurrencyError();
//     }
//   }

//   async getAggregate(uuid: string) {
//     const document = await this.model
//       .findOne({
//         uuid: uuid,
//       })
//       .sort({ position: -1 });

//     if (!document) {
//       throw new Error(`Entity not found`);
//     }

//     this._fetchedDocument = document;

//     return this.factory.hydrate(document.state, document.endEventPosition);
//   }

//   async save(aggregateRoot: AggregateRoot<S>) {
//     const state = aggregateRoot.getState();

//     if (!this._fetchedDocument) {
//       Logger.debug(`There is no fetched entity, assuming entity creation`);
//       await this.createNewBucket(state);
//     }

//     await this.handleBucketSize(state);

//     const document = assertExistence(this._fetchedDocument);

//     const result = await this.model.updateOne(
//       {
//         _id: `${state.uuid}_${document.position}`,
//         dataVersion: document.dataVersion,
//         startEventPosition: document.startEventPosition,
//       },
//       {
//         endEventPosition:
//           document.endEventPosition + aggregateRoot.getEvents().length,
//         state: state as any,
//         dataVersion: document.dataVersion + 1,
//         $push: {
//           events: aggregateRoot.getEvents().map((event, index) => ({
//             ...event,
//             position: document.endEventPosition + index,
//             correlationUuid: v4(),
//           })),
//           outbox: aggregateRoot.getEvents(),
//         },
//       }
//     );

//     if (result.n !== 1) {
//       throw new ConcurrencyError();
//     }

//     Logger.info(
//       `Updated state ${state.count} to document with version ${document.dataVersion}`
//     );
//   }
// }

// class TestFactory {
//   private _aggregate: TestAggregate | null = null;

//   hydrate(state: TestState, lastPosition: number) {
//     if (this._aggregate) {
//       throw new Error(
//         `Only single aggregate root can be handled inside a transaction`
//       );
//     }

//     this._aggregate = TestAggregate.hydrate(state, lastPosition);

//     return this._aggregate;
//   }

//   create(uuid: string) {
//     if (this._aggregate) {
//       throw new Error(
//         `Only single aggregate root can be handled inside a transaction`
//       );
//     }

//     this._aggregate = TestAggregate.create(uuid);

//     return this._aggregate;
//   }

//   getContextAggregate() {
//     return this._aggregate;
//   }
// }

// export type StreamDoc = BaseDocument<TestState>;

// const schema = new Schema({
//   _id: String,
//   schemaVersion: {
//     type: Number,
//     required: true,
//   },
//   startEventPosition: Number,
//   endEventPosition: Number,
//   position: Number,
//   dataVersion: Number,

//   uuid: String,
//   state: Object,
//   events: [Object],
//   outbox: [Object],
// });

// export const TestModel = model<StreamDoc>('test', schema);

// interface Context {
//   repository: Repository<TestState, TestAggregate>;
//   factory: TestFactory;
// }

// export class MessageBroker {
//   private _schema = new Schema({
//     schemaVersion: {
//       type: Number,
//       required: true,
//     },
//     startEventPosition: Number,
//     endEventPosition: Number,
//     dataVersion: Number,
//     lastEvent: String,
//     events: [Object],
//     locked: Boolean,
//   });

//   private _subject = new Subject();

//   private createLastDoc = async (stream: string) => {
//     const streamModel = model(`${stream}-stream`, this._schema);

//     await streamModel.updateOne(
//       { startEventPosition: 0 },
//       {
//         $setOnInsert: {
//           schemaVersion: 1,
//           startEventPosition: 0,
//           endEventPosition: 0,
//           dataVersion: 0,
//           lastEvent: '',
//           locked: false,
//           events: [],
//         },
//       },
//       { upsert: true }
//     );

//     return streamModel.findOne().sort({ startEventPosition: -1 });
//   };

//   private async handleBucketSize(doc: StreamDoc, stream: string) {
//     const streamModel = model(`${stream}-stream`, this._schema);

//     if (doc.endEventPosition - doc.startEventPosition >= 5) {
//       Logger.debug(
//         `Bucket over the event limit, creating new bucket with starting position ${doc.endEventPosition} and lastEvent ${doc.lastEvent}`
//       );
//       await streamModel.bulkWrite(
//         [
//           {
//             updateOne: {
//               filter: {
//                 startEventPosition: doc.startEventPosition,
//                 dataVersion: doc.dataVersion,
//                 locked: false,
//               },
//               update: {
//                 locked: true,
//               },
//             },
//           },
//           {
//             updateOne: {
//               filter: {
//                 startEventPosition: { $gt: doc.endEventPosition - 1 },
//               },
//               update: {
//                 $setOnInsert: {
//                   schemaVersion: 1,
//                   startEventPosition: doc.endEventPosition,
//                   endEventPosition: doc.endEventPosition,
//                   dataVersion: 0,
//                   events: [],
//                   lastEvent: doc.lastEvent as any,
//                   locked: false,
//                 },
//               },
//               upsert: true,
//             },
//           },
//         ],
//         { ordered: true }
//       );

//       return streamModel.findOne().sort({ startEventPosition: -1 });
//     } else {
//       return doc;
//     }
//   }

//   private publishEvent = async (event: any, stream: string) => {
//     const streamModel = model(`${stream}-stream`, this._schema);

//     let lastDoc = await streamModel.findOne().sort({ startEventPosition: -1 });
//     if (!lastDoc) {
//       lastDoc = this.createLastDoc(stream);
//     }
//     lastDoc = await this.handleBucketSize(lastDoc, stream);

//     if (lastDoc.lastEvent === event.correlationUuid) {
//       Logger.debug(
//         `Skipping event ${event.correlationUuid}, it already exists`
//       );
//       return;
//     }

//     const result = await streamModel.updateOne(
//       {
//         _id: lastDoc._id,
//         dataVersion: lastDoc.dataVersion,
//         locked: false,
//       },
//       {
//         endEventPosition: lastDoc.endEventPosition + 1,
//         lastEvent: event.correlationUuid,
//         dataVersion: lastDoc.dataVersion + 1,
//         $push: {
//           events: event,
//         },
//       }
//     );
//     Logger.debug(`Event ${event.correlationUuid} pubslished`);
//     this._subject.next(null);

//     if (result.n === 0) {
//       throw new ConcurrencyError();
//     }
//   };

//   async publish(event: any, stream: string) {
//     await this.publishEvent(event, stream);
//   }

//   subscribe(callback: () => void) {
//     this._subject.subscribe(callback);
//   }

//   getMessage = async (stream: string, messagePosition: number) => {
//     const streamModel = model(`${stream}-stream`, this._schema);

//     const doc = await streamModel.findOne({
//       startEventPosition: { $lte: messagePosition },
//       endEventPosition: { $gt: messagePosition },
//     });

//     if (!doc) {
//       return;
//     }

//     const event = doc?.events[messagePosition - doc.startEventPosition];

//     if (!event) {
//       return;
//     }

//     return event || undefined;
//   };
// }

// export class EventOutbox<S extends { uuid: string }> {
//   private _queue = new PromiseQueue(1, Infinity);
//   private _models: Model<BaseDocument<S>>[] = [];

//   constructor(private readonly broker: MessageBroker) {
//     // setInterval(() => {
//     //   this.checkout();
//     // }, 10000);
//   }

//   registerOutbox(model: Model<BaseDocument<S>>) {
//     this._models.push(model);
//   }

//   private async handleCheckout() {
//     Logger.debug(`Checking out outbox`);
//     try {
//       await Promise.all(
//         this._models.map(async (model) => {
//           const docs = await model.find({ 'outbox.0': { $exists: true } });

//           Logger.debug(`Found ${docs.length} docs with events in outbox`);

//           for (const doc of docs) {
//             for (const event of doc.outbox) {
//               Logger.debug(`Publishing event`);
//               await this.broker.publish(event, 'test');
//               const result = await model.updateOne(
//                 { _id: doc._id, dataVersion: doc.dataVersion },
//                 {
//                   $pull: {
//                     outbox: {
//                       correlationUuid: event.correlationUuid,
//                     },
//                   },
//                   dataVersion: doc.dataVersion + 1,
//                 }
//               );
//               if (result.n === 0) {
//                 Logger.warn(`Outbox did not update, doc was used`);
//                 throw new ConcurrencyError();
//               }
//             }
//           }
//         })
//       );
//     } catch (e) {
//       if (e.code === 'ConcurrencyError') {
//         this._queue.add(() => this.handleCheckout());
//       }
//     }
//   }

//   private enqueueCheckout = _.debounce(
//     () => this._queue.add(() => this.handleCheckout()),
//     0
//   );

//   checkout() {
//     this.enqueueCheckout();
//   }
// }

// export class TestContext {
//   constructor(private readonly eventOutbox: EventOutbox<TestState>) {
//     this.eventOutbox.registerOutbox(TestModel);
//   }

//   async handleWork(work: (context: Context) => Promise<void>) {
//     let finished = false;
//     let tries = 1;

//     while (!finished) {
//       try {
//         const factory = new TestFactory();
//         const repository = new Repository(TestModel, 1, 10, factory);

//         const context = {
//           repository,
//           factory,
//         };

//         await work(context);

//         const aggregate = factory.getContextAggregate();

//         if (!aggregate) {
//           throw new Error(`There is no aggregate to save in a unit of work`);
//         }

//         await context.repository.save(aggregate);
//         // this.eventOutbox.checkout();

//         finished = true;
//       } catch (e) {
//         if (e?.code === 'ConcurrencyError') {
//           tries++;
//           Logger.debug(`Update was not performed, retrying for ${tries} time`);

//           await new Promise<void>((res) => {
//             const waitTime = (tries - 1) * (50 + Math.random() * 100) * tries;
//             Logger.debug(`Waiting for ${waitTime}, ${tries}`);
//             setTimeout(() => {
//               res();
//             }, waitTime);
//           });
//         } else {
//           Logger.debug(`Other error`, e);

//           finished = true;
//         }
//       }
//     }
//   }
// }

// export class Consumer<S> {
//   private _schema = new Schema({
//     _id: String,
//     schemaVersion: {
//       type: Number,
//       required: true,
//     },
//     nextPosition: Number,
//     dataVersion: Number,
//     state: Object,
//   });

//   constructor(
//     private readonly reducer: (oldState: S, event: any) => S,
//     private readonly initialState: S,
//     private readonly name: string,
//     private readonly broker: MessageBroker
//   ) {}

//   async handleNextEvent() {
//     const consumerModel = model(`consumer`, this._schema);
//     let doc = await consumerModel.findOne({ _id: this.name });

//     if (!doc) {
//       await consumerModel.updateOne(
//         { _id: this.name },
//         {
//           $setOnInsert: {
//             nextPosition: 1,
//             dataVersion: 1,
//             state: this.initialState,
//           },
//         },
//         { upsert: true }
//       );
//       doc = await consumerModel.findOne({ _id: this.name });
//     }

//     const nextPosition = doc?.nextPosition || 0;
//     console.log(doc);
//     const event = await this.broker.getMessage(this.name, nextPosition);

//     if (!event) {
//       Logger.debug(`No next event, skipping`);
//       return;
//     }

//     console.log(event);

//     const state = this.reducer(event, doc?.state || this.initialState);

//     console.log(state);

//     await consumerModel.updateOne(
//       { _id: this.name },
//       {
//         state,
//         nextPosition: nextPosition + 1,
//         dateVersion: (doc?.dataVersion || 0) + 1,
//       }
//     );
//     Logger.debug(`Event consumed, new state`, state);
//   }

//   listen() {
//     setInterval(() => {
//       this.handleNextEvent();
//     }, 20);
//   }
// }
