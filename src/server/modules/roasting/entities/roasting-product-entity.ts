interface Props {
  id: number;
  roastedCoffeeId?: string | null;
}

export class RoastingProductEntity {
  private constructor(private props: Props) {}

  get id() {
    return this.props.id;
  }

  get roastedCoffeeId() {
    return this.props.roastedCoffeeId;
  }

  public static create(props: Props) {
    return new RoastingProductEntity(props);
  }

  updateRoastedCoffeeId(id?: string | null) {
    this.props.roastedCoffeeId = id;
  }
}
