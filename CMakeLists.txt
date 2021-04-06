cmake_minimum_required (VERSION 3.5)

project(AHDProject)

# 为了ide支持
SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON)

# find modules
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/modules/")

# 外部库目录 cmake-gui支持
set(3RD_PARTY_PATH "C:/Users/TuweiC/Desktop/3rd_party" CACHE PATH "导入统一的第三方库路径")

# 可执行文件输出路径
if(WIN32)
	set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)
endif(WIN32)

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
add_subdirectory(FilamentDemo)

# test
add_subdirectory(tests)

set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT AHDExample)
