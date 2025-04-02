export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Sort {
  private readonly _property: string;
  private readonly _direction: SortDirection;

  constructor(
    private readonly prop: string,
    private readonly dir: SortDirection = SortDirection.ASC,
  ) {
    this._property = prop;
    this._direction = dir;
  }

  public switchDirection(): Sort {
    return new Sort(
      this.property,
      this.ascending ? SortDirection.DESC : SortDirection.ASC,
    );
  }

  public setDirection(direction: SortDirection): Sort {
    return new Sort(this.property, direction);
  }

  public setProperty(property: string): Sort {
    return new Sort(property, this.direction);
  }

  public get direction(): SortDirection {
    return this._direction;
  }

  public get property(): string {
    return this._property;
  }

  public get ascending(): boolean {
    return this.direction === SortDirection.ASC;
  }

  public get descending(): boolean {
    return this.direction === SortDirection.DESC;
  }

  public toString(): string {
    return `${this.property},${this.direction}`;
  }
}
