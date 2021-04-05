cmake_minimum_required (VERSION 3.5)

project(AHDProject)

# find modules
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules/")

# find the required packages
# find_package(GLFW3 REQUIRED)
# message(STATUS "Found GLFW3 in ${GLFW3_INCLUDE_DIR}")
# find_package(ASSIMP REQUIRED)
# message(STATUS "Found ASSIMP in ${ASSIMP_INCLUDE_DIR}")
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
