import { Pipe, PipeTransform } from '@angular/core';
import { ChamUtils } from '@chamomile/core/utilities';

@Pipe({
  name: 'isEmpty',
})
export class IsEmptyPipe implements PipeTransform {
  transform(value: unknown): boolean {
    return ChamUtils.isEmpty(value);
  }
}
