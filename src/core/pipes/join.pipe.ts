import { Pipe, PipeTransform } from '@angular/core';

export interface JoinPipeConfig {
  separator?: string;
  key?: string;
}

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  public transform(value: any[], joinPipeConfig?: JoinPipeConfig): string {
    const separator = joinPipeConfig?.separator || ', ';
    const key = joinPipeConfig?.key || null;

    return key
      ? value.map((element) => element[key]).join(separator)
      : value.join(separator);
  }
}
