export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-User-ID",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Prevents ad account bans by tracking unique active installations safely
    const userId = request.headers.get("X-User-ID") || "veto_user_" + Math.random().toString(36).substring(7);
    const primaryNode = "162.159.192.1:2408"; 
    const secondaryNode = "162.159.193.1:2408";

    const dynamicConfig = {
      vpn_type: "WireGuard",
      user_tracking_id: userId,
      interface: {
        mtu: parseInt(env.MTU || "1280"),
        dns: "1.1.1.1, 8.8.8.8",
        address: "10.0.0.2/32"
      },
      modes: {
        normal_mode: {
          tunnels_active: 2,
          tunnel_1: { name: "Veto-Alpha-Normal", endpoint: primaryNode },
          tunnel_2: { name: "Veto-Beta-Normal", endpoint: secondaryNode }
        },
        turbo_mode: {
          tunnels_active: 3,
          tunnel_1: { name: "Veto-Alpha-Turbo", endpoint: primaryNode },
          tunnel_2: { name: "Veto-Beta-Turbo", endpoint: secondaryNode },
          tunnel_3: { name: "Veto-Gamma-Turbo", endpoint: "162.159.194.1:2408" }
        }
      },
      status: "ready_unblockable"
    };

    return new Response(JSON.stringify(dynamicConfig, null, 2), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "private, max-age=60"
      },
    });
  },
};
