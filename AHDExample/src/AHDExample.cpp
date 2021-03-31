#include <iostream>

#include "fmt/core.h"
#include "spdlog/spdlog.h"

#include "AHDExample/AHDExample.h"

void AHDExample::print()
{
    fmt::print("Hello, world!\n");
    spdlog::info("Welcome to spdlog!");
}
