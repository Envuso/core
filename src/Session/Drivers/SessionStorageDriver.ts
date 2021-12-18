export interface SessionStorageDriver {
	/**
	 * Write all of our session data that we have stored, into our session driver
	 * using the session id.
	 *
	 * @param {string} id
	 * @param {object} data
	 *
	 * @return {Promise<boolean>}
	 */
	writeSessionData(id: string, data: object): Promise<boolean>;

	/**
	 * Get an object of data from our session driver using the session id
	 *
	 * @param {string} id
	 * @return {Promise<object>}
	 */
	getSessionData(id: string): Promise<object>;

	/**
	 * Delete all session data stored by the specified session id
	 *
	 * @param {string} id
	 * @return {Promise<boolean>}
	 */
	destroy(id: string): Promise<boolean>;
}
