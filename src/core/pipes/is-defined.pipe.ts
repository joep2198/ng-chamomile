import { Pipe, PipeTransform } from '@angular/core';
import { ChamUtils } from '@chamomile/core/utilities';

@Pipe({
  name: 'isDefined',
})
export class IsDefinedPipe implements PipeTransform {
  transform<T>(value: T | null | undefined): value is T {
    return ChamUtils.isDefined(value);
  }
}
