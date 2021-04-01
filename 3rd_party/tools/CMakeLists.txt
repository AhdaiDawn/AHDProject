project(tools)

file(GLOB_RECURSE TOOLS_HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/*.h")
# Prepare "Catch2" library for other executables
add_library(tools INTERFACE ${TOOLS_HEADERS})
add_library(tools::tools ALIAS tools)
target_include_directories(tools INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})
