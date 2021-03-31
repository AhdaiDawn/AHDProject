cmake_minimum_required(VERSION 3.0)

project(catch2)

file(GLOB_RECURSE CATCH2_HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/*.hpp")
# Prepare "Catch2" library for other executables
add_library(Catch2 INTERFACE ${CATCH2_HEADERS})
add_library(Catch2::Test ALIAS Catch2)
target_include_directories(Catch2 INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})
