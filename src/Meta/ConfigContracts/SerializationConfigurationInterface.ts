import { DataTransferObjectSerialization } from "../../Routing";

export interface SerializationConfigurationInterface {
    /**
     * When a data transfer object is used with the @dto()
     * decorator on a controller method.
     */
    dataTransferObjects: DataTransferObjectSerialization;
}
