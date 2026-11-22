/**
 * Wrap the type of a model relation property in Relation<T>, e.g. `user: Relation<User>`.
 *
 * Models that reference each other (User <-> Book) form a circular import. With
 * emitDecoratorMetadata, a bare `user: User` emits a runtime reference to `User`, which
 * throws "Cannot access before initialization" under ESM/Bun. Relation<T> is a type alias,
 * so the metadata falls back to Object and the cycle is harmless. Same approach as TypeORM.
 */
export type Relation<T> = T;
