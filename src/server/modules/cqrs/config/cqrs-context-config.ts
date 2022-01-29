import { CommandBus } from '../buses/command-bus';
import { EventBus } from '../buses/event-bus';
import { QueryBus } from '../buses/query-bus';

export type ContextConfig = MasterConfig | WorkerConfig;

interface CommonConfig {
  /** 
    Consumer can define their own implementation of CQRS buses or use one of the default ones, default is Bull implementation 
  */
  cqrs?: {
    CommandBus?: new (...arg: never[]) => CommandBus;
    EventBus?: new (...arg: never[]) => EventBus;
    QueryBus?: new (...arg: never[]) => QueryBus;
  };

  /** 
    If application already defines its own instance of Sequelize, it can be provided to 
    db context
  */
}

export interface MasterConfig extends CommonConfig {
  /**
   * This attribute sets application context as master, this context will be able dispatch commands,
   * and it will handle events and sagas. Master process does not handle commands.
   */
  master: true;
  /**
   * Allows master to process commands, default is false. Needs to be enabled for InProcess CQRS implementation, otherwise bootstrap will fail.
   */
  processJobs?: boolean;
  /**
   * Command queues that are processed by this worker, by default, "commands" (DEFAULT_COMMAND_QUEUE) queue is processed.
   * InProcess implementation processes all commands without respecting the queue name.
   */
  commandQueues?: string[];
  /**
   * Query queues that are processed by this worker, by default, "queries" (DEFAULT_QUERY_QUEUE) queue is processed.
   *  InProcess implementation processes all queries without respecting the queue name.
   */
  queryQueues?: string[];
  /** 
    Provide sharding command name and available queues, between which the work should be distributed.
    Jobs are distributed to the queues based on the resource key of the given command.
    InProcess implementation obviously ignores sharding (there is nothing to shard).
  */
  commandShardingConfig?: { name: string; queues: string[] }[];
  /** 
    Provide sharding command name and available queues, between which the work should be distributed.
    Jobs are distributed to the queues based on the resource key of the given command.
    InProcess implementation obviously ignores sharding (there is nothing to shard).
  */
  queryShardingConfig?: { name: string; queues: string[] }[];
}

/**
 * Workers handle commands, queries and they can dispatch events.
 */
export interface WorkerConfig extends CommonConfig {
  /**
   * Worker handles commands and queries for declared queues. It does not handle events and sagas.
   */
  worker: true;
  /**
   * Command queues that are processed by this worker, by default, "commands" (DEFAULT_COMMAND_QUEUE) queue is processed
   */
  commandQueues?: string[];
  /**
   * Query queues that are processed by this worker, by default, "queries" (DEFAULT_QUERY_QUEUE) queue is processed
   */
  queryQueues?: string[];
}

export const isMaster = (
  contextConfig: ContextConfig
): contextConfig is MasterConfig => {
  if ('master' in contextConfig) {
    return true;
  }
  return false;
};

export const isWorker = (
  contextConfig: ContextConfig
): contextConfig is WorkerConfig => {
  if ('master' in contextConfig) {
    return false;
  }
  return true;
};

export const DEFAULT_COMMAND_QUEUE = 'commands';
export const DEFAULT_QUERY_QUEUE = 'queries';
