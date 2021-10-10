interface RoastedCoffeeProps {
  id: string;
  name: string;
  greenCoffeeId: string;
}

const checkinvariants = (props: RoastedCoffeeProps) => {
  if (props.greenCoffeeId.length === 0) {
    throw new Error('GreenCoffeeId can not be empty string');
  }
};

export class RoastedCoffeeEntity {
  private constructor(private props: RoastedCoffeeProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get greenCoffeeId(): string {
    return this.props.greenCoffeeId;
  }

  public static create(props: RoastedCoffeeProps) {
    checkinvariants(props);
    return new RoastedCoffeeEntity(props);
  }

  updateProperties(props: { name?: string; greenCoffeeId?: string }) {
    const newProps = { ...this.props, ...props };
    checkinvariants(newProps);
    this.props = newProps;
  }
}
