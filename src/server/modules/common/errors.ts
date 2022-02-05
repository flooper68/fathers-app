export class DomainError extends Error {}

export class DomainInvariantError extends Error {}

export class QueryError extends Error {}

export class UniqueEntityConstraintError extends Error {}

export class EntityNotFoundError extends Error {
  constructor() {
    super(`Entity not found`);
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

export class ValueObjectNotFoundError extends Error {}

export class ApplicationError extends Error {}

export class InfrastructureError extends Error {}

export class UnknownError extends Error {}
