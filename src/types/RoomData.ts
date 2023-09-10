import { ClientStatus } from "./clientStatus"
import { ServerStatus } from "./serverStatus"

export type RoomData = {
    serverStatus: ServerStatus,
    clients: {
        white: {
            id: number,
            clientStatus: ClientStatus
        },
        black: {
            id: number,
            clientStatus: ClientStatus
        }
    },
    viewers: {
        ids: number[]
    }
}