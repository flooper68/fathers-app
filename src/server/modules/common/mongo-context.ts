// import PromiseQueue from 'promise-queue';
// import { model, Model, Schema } from 'mongoose';

// import { assertExistence } from './assert-existence';
// import { Logger } from '../../../shared/logger';
// import { rest } from 'lodash';
// import { Subject } from 'rxjs';
// import { v4 } from 'uuid';
// import _ from 'lodash';
// import e from 'express';

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
