/**
 * Emitter super simple class
 *
 * Events will be prefixed with the given `namespace` plus a `.` so:
 * `{namespace}.myevent`
 *
 * Adapted from https://github.com/developit/mitt
 *
 * Regarding typescript support @see:
 * - https://stackoverflow.com/q/53299743/1938970
 * - https://github.com/Microsoft/TypeScript/pull/26349
 */
export function Emitter<EventMap extends Record<string, any>>(
  namespace: string
) {
  const all = new Map();

  return {
    /**
     * Register an event handler for the given type.
     */
    on<EventName extends keyof EventMap>(
      name: EventName,
      handler: (data?: EventMap[EventName]) => any
    ) {
      const handlers = all.get(`${namespace}.${name}`);
      const added = handlers && handlers.push(handler);
      if (!added) {
        all.set(`${namespace}.${name}`, [handler]);
      }
    },

    /**
     * Invoke all handlers for the given type.
     */
    emit<EventName extends keyof EventMap>(
      name: EventName,
      data?: EventMap[EventName]
    ) {
      (all.get(`${namespace}.${name}`) || [])
        .slice()
        .map((handler: (data?: EventMap[EventName]) => any) => {
          handler(data);
        });
    },
  };
}
