import { Pipe, PipeTransform } from '@angular/core';
import { ChamUtils } from '@chamomile/core/utilities';

@Pipe({
  name: 'isNil',
})
export class IsNilPipe implements PipeTransform {
  transform<T>(value: T | null | undefined): value is null | undefined {
    return ChamUtils.isNil(value);
  }
}
