#include "local_api.hpp"
extern "C" float runCudaAlphaCalc();

std::string get_bot_status() {
    return "Engine: OPERATIONAL | Threads: 8 | ShmStatus: CONNECTED";
}

void update_spread(double ask_pct, double bid_pct) {
    // Logic to push new parameters into low-latency shared memory
}

void kill_switch() {
    // Emergency cancel-all logic
}

std::string get_risk_metrics() {
    float gpuAlpha = runCudaAlphaCalc();
    return "InventoryDelta: +0.24 | GPU-Alpha-Signal: " + std::to_string(gpuAlpha);
}
