import { Subprocess, execa } from "execa";
import waitOn from "wait-on";

interface DevServer {
  process: Subprocess; // ExecaChildProcess;
  stop: () => void;
  baseUrl: string;
}

export async function startNextDev(
  projectRoot: string,
  port = 3000,
): Promise<DevServer> {
  const devProcess = execa("npx", ["next", "dev", "-p", port.toString()], {
    cwd: projectRoot,
    stdout: "inherit",
    stderr: "inherit",
  });

  // Wait for dev server to become available
  await waitOn({
    resources: [`http://localhost:${port}`],
    timeout: 10000, // adjust as needed
  });

  return {
    process: devProcess,
    stop: () => devProcess.kill("SIGTERM"),
    baseUrl: `http://localhost:${port}`,
  };
}
