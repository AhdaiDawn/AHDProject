cmake_minimum_required (VERSION 3.5)

project(AHDProject)

# 获取项目路径
configure_file(3rd_party/tools/root_directory.h.in configuration/root_directory.h)
include_directories(${CMAKE_BINARY_DIR}/configuration)

# Add sub directories
# add_subdirectory(cmake)
add_subdirectory(3rd_party)

# my subProject
add_subdirectory(AHDExample)
add_subdirectory(AHDOpenCV)
add_subdirectory(AHDQtProject)
# add_subdirectory(FilamentDemo)

# test
add_subdirectory(tests)

set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT AHDExample)
