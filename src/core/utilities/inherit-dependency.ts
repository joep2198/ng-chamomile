import {
  ClassProvider,
  InjectionToken,
  Injector,
  Optional,
  Provider,
  SkipSelf,
  Type,
  ValueProvider,
} from '@angular/core';

export function provideInheritedDependency<T>(
  token: Type<T> | InjectionToken<T>,
  fallBack?: T,
): Provider {
  return {
    provide: token,
    useFactory: inheritDependency(token, fallBack),
    deps: [Injector, [new Optional(), new SkipSelf(), token]],
  };
}

function inheritDependency<T>(
  token: Type<T> | InjectionToken<T>,
  fallBack?: T,
): (parentInjector: Injector, injectable?: T) => T {
  return (parentInjector: Injector, injectable?: T) => {
    if (!injectable) {
      // If parent did not provide any injection token, provide a self instantiated new one
      let tokenProvider: ClassProvider | ValueProvider;

      if (token instanceof InjectionToken) {
        tokenProvider = {
          provide: token,
          useValue: fallBack,
        };
      } else {
        tokenProvider = {
          provide: token,
          useClass: token,
        };
      }

      const injector = Injector.create({
        providers: [tokenProvider],
        parent: parentInjector,
      });
      return injector.get(token);
    } else {
      // Otherwise use the parent token
      return injectable;
    }
  };
}
