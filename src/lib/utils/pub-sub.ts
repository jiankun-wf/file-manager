// 观察、订阅者模式。
type Id = string | number;
type HandlerFn = (...args: any[]) => void | Promise<any>;
type HanlderConfig = {
  id: Id;
  once?: boolean;
  handler: HandlerFn;
};
type ListenerHandler = HandlerFn | HanlderConfig;
type HandleResult = { is__delete: boolean; origin: ListenerHandler };

const isType = (value: any, type: string): boolean => {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
};

class User {
  private listeners: Record<string, ListenerHandler[]> = {};

  protected getListener = () => this.listeners;

  public $listen = (name: string, handler: ListenerHandler) => {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(handler);
  };
}

class PubCenter extends User {
  // 触发订阅
  private $trigger = async (
    handlers: ListenerHandler[],
    ...args: any[]
  ): Promise<HandleResult[]> => {
    let result: HandleResult[] = [];
    for (let current of handlers) {
      let is__delete = false;
      if (isType(current, "Function")) {
        await (current as HandlerFn)(...args);
      } else {
        await (current as HanlderConfig).handler(...args);
        is__delete = (current as HanlderConfig).once === true;
      }
      result.push({ is__delete, origin: current });
    }
    return result;
  };
  // 分发订阅
  public $emit = async (name: string, ...args: any[]) => {
    const listeners = this.getListener();
    if (!listeners[name] || !listeners[name].length) return;

    const handleResult = await this.$trigger(listeners[name], ...args);
    listeners[name] = handleResult
      .filter((item) => !item.is__delete)
      .map((item) => item.origin);
  };

  // 精准分发
  public $scope = async (name: string, query: Id | Id[], ...args: any[]) => {
    const listeners = this.getListener();

    if (!listeners[name] || !listeners[name].length) return;

    const filterResult: Record<"origin" | "trigger", ListenerHandler[]> =
      listeners[name].reduce(
        (store: Record<"origin" | "trigger", ListenerHandler[]>, current) => {
          let flag = false;
          if (!isType(current, "Function")) {
            const { id } = (current as HanlderConfig) || {};
            if (isType(query, "String")) {
              flag = query === id;
            } else if (isType(query, "Array")) {
              flag = (query as Id[]).includes(id);
            }
          }
          store[flag ? "trigger" : "origin"].push(current);
          return store;
        },
        { origin: [], trigger: [] }
      );

    const handleResult = await this.$trigger(filterResult.trigger, ...args);

    listeners[name] = filterResult.origin.concat(
      handleResult.filter((item) => !item.is__delete).map((item) => item.origin)
    );
  };
  // 取消订阅
  public $unListen = (name: string, handler?: HandlerFn | Id | Id[]) => {
    const listeners = this.getListener();
    if (!listeners[name]) return;
    if (!handler) {
      delete listeners[name];
      return;
    }
    listeners[name] = listeners[name]?.filter?.((fnItem) => {
      if (isType(handler, "Funtion")) {
        return isType(fnItem, "Funtion")
          ? fnItem !== handler
          : (fnItem as HanlderConfig).handler !== handler;
      } else {
        if (isType(handler, "Array")) {
          return !(handler as Id[]).includes((fnItem as HanlderConfig).id);
        } else {
          return (fnItem as HanlderConfig).id !== handler;
        }
      }
    });
  };
}

export const eventBus = new PubCenter();
