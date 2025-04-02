import { Pagination } from '@chamomile/core/models/pagination.model';
import { Sort, SortDirection } from '@chamomile/core/models/sort.model';
import { Maybe } from '@chamomile/core/models/types/maybe.type';
import { ChamUtils } from '@chamomile/core/utilities';

export class ListUtilities {
  public static getDataSlice<T>(
    data: T[],
    pagination?: Maybe<Pagination>,
    sort?: Maybe<Sort>,
    useKey?: Maybe<keyof T>,
  ): T[] {
    const sortedElements = ListUtilities.sortElements(data, sort, useKey);
    if (ChamUtils.isNil(pagination)) {
      return sortedElements;
    } else {
      return sortedElements.slice(
        pagination.maxElementsPerPage * (pagination.currentPage - 1),
        pagination.maxElementsPerPage * (pagination.currentPage - 1) +
          pagination.maxElementsPerPage,
      );
    }
  }

  public static sortElements<T>(
    data: T[],
    sort?: Maybe<Sort>,
    useKey?: Maybe<keyof T>,
  ): T[] {
    if (ChamUtils.isNil(sort)) {
      return data;
    }

    return data.sort((a, b) => {
      const aValues = ListUtilities.getIteratees(a, sort, useKey);
      const bValues = ListUtilities.getIteratees(b, sort, useKey);

      for (let i = 0; i < aValues.length; i++) {
        if ((aValues[i] as any) < (bValues[i] as any)) {
          return sort.direction === SortDirection.ASC ? -1 : 1;
        }
        if ((aValues[i] as any) > (bValues[i] as any)) {
          return sort.direction === SortDirection.ASC ? 1 : -1;
        }
      }
      return 0;
    });
  }

  public static getIteratees<T>(
    value: T,
    sort: Sort,
    useKey?: Maybe<keyof T>,
  ): unknown[] {
    const sortingFields = sort.property.split(',');
    const sortingFieldsMap = sortingFields.map((s) =>
      `${useKey ? useKey.toString() + '.' : ''}${s}`.split('.'),
    );

    if (!ChamUtils.isNil(sortingFieldsMap)) {
      return ListUtilities.getIterateesValues(value, sortingFieldsMap, []);
    }
    return [];
  }

  public static getIterateesValues<T>(
    value: T,
    sortingFields: string[][],
    resultFields: unknown[] = [],
  ): unknown[] {
    sortingFields.forEach((f) => {
      if (f.length === 1) {
        resultFields.push(
          !ChamUtils.isNil(value[f[0] as keyof T])
            ? value[f[0] as keyof T]
            : '',
        );
      } else {
        resultFields.push(
          ListUtilities.getIterateesValues(
            value[f[0] as keyof T],
            [f.slice(1)],
            resultFields,
          ),
        );
      }
    });

    return resultFields;
  }
}
