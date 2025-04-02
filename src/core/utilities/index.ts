import {
  DeepKeyOf,
  ValueAtPath,
} from '@chamomile/core/models/types/deep-key-of.type';
import { DeepPartial } from '@chamomile/core/models/types/deep-partial.type';
import { ListUtilities } from '@chamomile/core/utilities/list';

export class ChamUtils {
  public static list = ListUtilities;

  public static isNil<T>(
    value: T | null | undefined,
  ): value is null | undefined {
    return value === undefined || value === null;
  }

  public static isDefined<T>(value: T | null | undefined): value is T {
    return !this.isNil(value);
  }

  public static isEmpty(value: unknown): boolean {
    if (this.isArray(value)) {
      return value.length === 0;
    } else {
      return this.isNil(value) || value === '';
    }
  }

  public static isObject(value: unknown): value is Record<string, unknown> {
    return this.isDefined(value) && typeof value === 'object';
  }

  public static isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
  }

  public static getValueByDeepKey<T extends object, K extends DeepKeyOf<T>>(
    obj: T,
    key: K,
  ): ValueAtPath<T, K> {
    const keys = key.split('.') as (keyof T)[];
    let result: any = obj;

    for (const k of keys) {
      result = result[k];
      if (result === undefined) {
        throw new Error(
          `getValueByDeepKey: key "${k.toString()}" not found in object.`,
        );
      }
    }

    return result as ValueAtPath<T, K>;
  }

  public static isEqual(value1: unknown, value2: unknown): boolean {
    // Get the value type
    const type1 = Object.prototype.toString.call(value1);
    const type2 = Object.prototype.toString.call(value2);

    // If the two items are not the same type, return false
    if (type1 !== type2) {
      return false;
    }

    // Compare arrays with ordered elements
    if (this.isArray(value1) && this.isArray(value2)) {
      if (value1.length !== value2.length) {
        return false;
      }
      for (let i = 0; i < value1.length; i++) {
        if (!this.isEqual(value1[i], value2[i])) {
          return false;
        }
      }
      return true;
    }

    if (this.isObject(value1) && this.isObject(value2)) {
      const valueKeys = Object.keys(value1);
      const otherKeys = Object.keys(value2);
      if (valueKeys.length !== otherKeys.length) {
        return false;
      }
      for (const key of valueKeys) {
        if (!otherKeys.includes(key)) {
          return false;
        }
        if (!this.isEqual(value1[key], value2[key])) {
          return false;
        }
      }
      return true;
    }

    return value1 === value2;
  }

  public static findKeyByValue<T extends object>(
    obj: T,
    value: any,
  ): keyof T | null {
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        obj[key] === value
      ) {
        return key;
      }
    }
    return null;
  }

  public static deepMerge<T extends object>(
    baseObject: T,
    mergeObject: DeepPartial<T> | undefined,
  ): T {
    if (mergeObject === undefined) {
      return baseObject;
    }

    const result = { ...baseObject };

    for (const key in mergeObject) {
      if (Object.prototype.hasOwnProperty.call(mergeObject, key)) {
        if (typeof mergeObject[key] === 'object' && mergeObject[key] !== null) {
          try {
            // @ts-expect-error ==> Ts cannot infer that key is a valid index
            result[key] = ChamUtils.deepMerge(result[key], mergeObject[key]);
          } catch (e) {
            console.error(e);
          }
        } else {
          try {
            // @ts-expect-error ==> Ts cannot infer that key is a valid index
            result[key] = mergeObject[key];
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    return result;
  }
}
