export type DeepKeyOf<T, Cache extends string = ''> = T extends PropertyKey
  ? Cache
  : keyof T extends object
    ? Cache
    : {
        [P in keyof T]: P extends string | number
          ? Cache extends ''
            ? DeepKeyOf<T[P], `${P}`>
            : Cache | DeepKeyOf<T[P], `${Cache}.${P}`>
          : never;
      }[keyof T];

export type ValueAtPath<
  T,
  K extends DeepKeyOf<T>,
> = K extends `${infer F}.${infer R}`
  ? F extends keyof T
    ? R extends string
      ? ValueAtPath<T[F], DeepKeyOf<T[F], ''>>
      : never
    : never
  : K extends keyof T
    ? T[K]
    : never;
