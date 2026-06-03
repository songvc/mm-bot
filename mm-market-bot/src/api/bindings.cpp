#include <napi.h>
#include "local_api.cpp"

Napi::String GetBotStatusWrapped(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), get_bot_status());
}

Napi::Value UpdateSpreadWrapped(const Napi::CallbackInfo& info) {
    double ask_pct = info[0].As<Napi::Number>().DoubleValue();
    double bid_pct = info[1].As<Napi::Number>().DoubleValue();
    update_spread(ask_pct, bid_pct);
    return info.Env().Undefined();
}

Napi::Value KillSwitchWrapped(const Napi::CallbackInfo& info) {
    kill_switch();
    return Napi::Boolean::New(info.Env(), true);
}

Napi::String GetRiskMetricsWrapped(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), get_risk_metrics());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getBotStatus", Napi::Function::New(env, GetBotStatusWrapped));
    exports.Set("updateSpread", Napi::Function::New(env, UpdateSpreadWrapped));
    exports.Set("killSwitch", Napi::Function::New(env, KillSwitchWrapped));
    exports.Set("getRiskMetrics", Napi::Function::New(env, GetRiskMetricsWrapped));
    return exports;
}

NODE_API_MODULE(mm_core, Init)
