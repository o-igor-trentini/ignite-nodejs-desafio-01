export function buildRoutePath(path)  {
    const routeParameterRegex = /:([a-zA-z]+)/g;
    const pathWithParams = path.replaceAll(routeParameterRegex, '(?<$1>[a-z0-9\-_]+)');

    return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
}
