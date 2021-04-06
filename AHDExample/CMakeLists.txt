cmake_minimum_required(VERSION 3.5)

# Set the project name
project(AHDExample)

# Create the executable
add_library(${PROJECT_NAME} src/AHDExample.cpp include/AHDExample/AHDExample.h)
add_library(${PROJECT_NAME}::${PROJECT_NAME} ALIAS ${PROJECT_NAME})

# find
find_package(spdlog REQUIRED)

target_link_libraries(${PROJECT_NAME} PRIVATE
    fmt::fmt
    spdlog::spdlog
)
target_include_directories( ${PROJECT_NAME}
    PUBLIC ${PROJECT_SOURCE_DIR}/include
)
