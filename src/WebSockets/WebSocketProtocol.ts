/**
 * Subprotocol a client offers alongside its JWT ("envuso", <jwt>). The server echoes
 * this one, so the token is not repeated in the upgrade response headers.
 */
export const WEBSOCKET_PROTOCOL = "envuso";
