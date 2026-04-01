// Keep the process entrypoint tiny.
//
// All Node-specific boot logic lives deeper in src/server so this file stays
// stable even as we add more websocket endpoints later.
import { startServer } from './http/startServer';

void startServer();
