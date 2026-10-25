import { auditBuildAssets } from "./deployment-assets.ts";
const result = await auditBuildAssets({ directory: "space-invaders/dist", deploymentUrl: "https://samuelasherrivello-com-ai.github.io/babylon-lite-invaders-of-space-multiplayer/", obsoleteBases: ["/babylon-lite-space-invaders-clone/"] });
if (result.failures.length) throw new Error(result.failures.join("\n"));
console.log("Production asset paths checked:", result.checked.length);
