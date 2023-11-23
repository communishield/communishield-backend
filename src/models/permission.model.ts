import {
  type Platform,
  type TransformContext,
  Type,
  type EntityProperty,
} from "@mikro-orm/core";

export class Permission extends Type<Permission, number> {
  static fromNumber(permission: number) {
    return new Permission(
      /* eslint-disable no-bitwise */
      { read: (permission & 1) === 1, write: (permission & 2) === 2 },
      { read: (permission & 4) === 4, write: (permission & 8) === 8 },
      { read: (permission & 16) === 16, write: (permission & 32) === 32 },
      /* eslint-enable no-bitwise */
    );
  }

  constructor(
    private readonly ownerPermission: { read: boolean; write: boolean },
    private readonly groupPermission: { read: boolean; write: boolean },
    private readonly userPermission: { read: boolean; write: boolean },
  ) {
    super();
  }

  toNumber() {
    return (
      /* eslint-disable no-bitwise */
      (this.ownerPermission.read ? 1 : 0) |
      (this.ownerPermission.write ? 2 : 0) |
      (this.groupPermission.read ? 4 : 0) |
      (this.groupPermission.write ? 8 : 0) |
      (this.userPermission.read ? 16 : 0) |
      (this.userPermission.write ? 32 : 0)
      /* eslint-enable no-bitwise */
    );
  }

  convertToDatabaseValue(
    value: number | Permission,
    _platform: Platform,
    _context?: boolean | TransformContext | undefined,
  ) {
    if (value instanceof Permission) {
      return value.toNumber();
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  convertToJSValue(
    value: number | Permission,
    _platform: Platform,
  ): Permission {
    if (value instanceof Permission) {
      return value;
    }

    return Permission.fromNumber(value);
  }

  getColumnType(_prop: EntityProperty, _platform: Platform) {
    return "int";
  }
}
