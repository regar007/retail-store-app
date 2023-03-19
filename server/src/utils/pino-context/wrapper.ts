// Proxy an instance of pino to return the proper proxy
const loggerObjectHandler = {
    get(target: any, prop: any) {
        if (target.proxies && target.proxies[prop]) {
            return target.proxies[prop];
        }

        return target[prop];
    },
};

export function createWrapper(instance: any, logWrapper: any) {
    const loggerWithProxies: Object = Object.create(instance, {
        proxies: {
            value: {
                critical: logWrapper(instance.critical.bind(instance)),
                notice: logWrapper(instance.notice.bind(instance)),
                alert: logWrapper(instance.alert.bind(instance)),
                debug: logWrapper(instance.debug.bind(instance)),
                info: logWrapper(instance.info.bind(instance)),
                warning: logWrapper(instance.warning.bind(instance)),
                error: logWrapper(instance.error.bind(instance)),
                emergency: logWrapper(instance.emergency.bind(instance)),

                // Override the child method to return a wrapped instance
                child: new Proxy(instance.child, {
                    apply(target, thisArg, argumentList) {
                        return createWrapper(target.apply(thisArg, argumentList), logWrapper);
                    },
                }),
            },
        },
    });

    return new Proxy(loggerWithProxies, loggerObjectHandler);
}
