import { Container, injectable } from "inversify";

const container = new Container();

export function bind<
  T = any,
  Constructor extends new (...args: any[]) => T = new (...args: any[]) => T,
>(identifier: string, singleton = true) {
  return function (constructor: Constructor) {
    injectable()(constructor);

    const binding = container.bind<T>(identifier).to(constructor);

    if (singleton) {
      binding.inSingletonScope();
    }
  };
}

export { container };
