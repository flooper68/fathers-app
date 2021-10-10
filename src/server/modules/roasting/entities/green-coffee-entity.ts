interface GreenCoffeeProps {
  id: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

const checkInvariants = (props: GreenCoffeeProps) => {
  if (props.roastingLossFactor < 0 || props.roastingLossFactor > 1) {
    throw new Error(`Roasting loss factor must be between 0 and 1`);
  }

  if (props.batchWeight <= 0) {
    throw new Error(`Batch weight must be positive number higher than 0`);
  }
};

export class GreenCoffeeEntity {
  private constructor(private props: GreenCoffeeProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get batchWeight(): number {
    return this.props.batchWeight;
  }

  get roastingLossFactor(): number {
    return this.props.roastingLossFactor;
  }

  public static create(props: GreenCoffeeProps) {
    checkInvariants(props);
    return new GreenCoffeeEntity(props);
  }

  updateProperties(props: {
    name?: string;
    batchWeight?: number;
    roastingLossFactor?: number;
  }) {
    const newProps = { ...this.props, ...props };
    checkInvariants(newProps);
    this.props = newProps;
  }
}
