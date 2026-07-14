export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function getAdminCredentials() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment");
  }

  return {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
}

export function isAdminCredential(email: string, password: string): boolean {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return false;
  }

  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export const USER_DASHBOARD_PATH = "/dashboard";
export const USER_TICKETS_PATH = "/dashboard/tickets";
export const AGENT_DASHBOARD_PATH = "/agents/dashboard";
export const AGENT_TICKETS_PATH = "/agents/dashboard/tickets";
export const AGENT_PENDING_AGENTS_PATH = "/agents/dashboard/agents";
export const AGENT_PORTAL_PATH = "/agents";
export const USER_PORTAL_PATH = "/";
