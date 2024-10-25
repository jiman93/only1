import { Invites } from "@/mocks/invites";
import { Invite } from "@/types/model";

// In-memory storage for mock invites
export let entries: Invite[] = [...Invites];
