import { ClientStatus } from "../types/clientStatus";

export const unpackCS = (data: string): ClientStatus => {
    return JSON.parse(data);
}