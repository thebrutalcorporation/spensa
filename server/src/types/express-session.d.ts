//type for properties added to session object.
import { Session } from "express-session";

declare module "express-session" {
  interface Session {
    userId: string;
  }
}
