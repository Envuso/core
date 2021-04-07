export declare enum DESIGN_META {
    DESIGN_PARAM_TYPES = "design:paramtypes",
    DESIGN_TYPE = "design:type",
    DESIGN_PROPERTIES = "design:properties",
    DESIGN_RETURN_TYPE = "design:returntype"
}
/**
 * All of our reflect metadata accessor names
 */
export declare enum METADATA {
    CONTROLLER = "controller",
    CONTROLLER_METHODS = "controller-methods",
    HTTP_CONTEXT = "http-context",
    MIDDLEWARE = "middleware",
    REQUEST_METHOD_DTO = "request-method-dto",
    REQUEST_METHOD_FASTIFY_REQUEST = "request-method-fastify-request",
    REQUEST_METHOD_ROUTE_PARAMETER = "request-method-route-parameter",
    REQUEST_METHOD_QUERY_PARAMETER = "request-method-query-parameter",
    REQUEST_METHOD_BODY = "request-method-body",
    REQUEST_METHOD_HEADERS = "request-method-headers",
    MODEL = "MODEL"
}
/**
 * We set all of our controller request param meta keys here
 * Otherwise it will bork because it will try to use other things
 */
export declare const CONTROLLER_METHOD_PARAMS: Array<METADATA>;
