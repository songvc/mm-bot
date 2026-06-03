#pragma once
#include <string>

std::string get_bot_status();
void update_spread(double ask_pct, double bid_pct);
void kill_switch();
std::string get_risk_metrics();
