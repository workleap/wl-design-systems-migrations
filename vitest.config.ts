import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [...configDefaults.include, "./**/*.test.ts"]
    // **UNCOMMENT** the following lines to enable profiling
    // pool: "forks",
    // poolOptions: {
    //   forks: {
    //     execArgv: [
    //       "--cpu-prof",
    //       "--cpu-prof-dir=test-runner-profile",
    //       "--heap-prof",
    //       "--heap-prof-dir=test-runner-profile"
    //     ],

    //     // To generate a single profile
    //     singleFork: true
    //   }
    // }
  }
});
