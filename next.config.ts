import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the landing page is one route of server components with no data
  // fetching, so it compiles to plain HTML that EdgeOne Pages serves directly. The
  // audit agent is deployed separately from `agents/` and is not part of this build.
  output: "export",
  // `next/image` optimisation needs a server. There is none behind a static export.
  images: { unoptimized: true },
};

export default nextConfig;
