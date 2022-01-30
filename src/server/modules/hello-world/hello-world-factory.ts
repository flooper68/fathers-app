import { HelloWorldAggregateRoot, HelloWorldState } from './hello-world-root';

export class HelloWorldFactory {
  constructor(
    private readonly onHydrated: (root: HelloWorldAggregateRoot) => void
  ) {}

  hydrate(state: HelloWorldState, lastPosition: number) {
    const root = HelloWorldAggregateRoot.hydrate(state, lastPosition);

    this.onHydrated(root);

    return root;
  }

  create(uuid: string) {
    const root = HelloWorldAggregateRoot.create(uuid);

    this.onHydrated(root);

    return root;
  }
}
