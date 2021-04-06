# Locate the glfw3 library
#
# This module defines the following variables:
#
# GLFW3_LIBRARY the name of the library;
# GLFW3_INCLUDE_DIR where to find glfw include files.
# GLFW3_FOUND true if both the GLFW3_LIBRARY and GLFW3_INCLUDE_DIR have been found.
#
# To help locate the library and include file, you can define a
# variable called GLFW3_ROOT which points to the root of the glfw library
# installation.
#
# default search dirs
#
# Cmake file from: https://github.com/daw42/glslcookbook

set( _glfw3_HEADER_SEARCH_DIRS
"/usr/include"
"/usr/local/include"
"${3RD_PARTY_PATH}/glfw/include" )
set( _glfw3_LIB_SEARCH_DIRS
"/usr/lib"
"/usr/local/lib"
"${3RD_PARTY_PATH}/glfw/lib" )

# Search for the header
FIND_PATH(GLFW3_INCLUDE_DIR "GLFW/glfw3.h"
PATHS ${_glfw3_HEADER_SEARCH_DIRS} )

# Search for the library
FIND_LIBRARY(GLFW3_LIBRARY NAMES glfw3 glfw
PATHS ${_glfw3_LIB_SEARCH_DIRS} )
# file(GLOB_RECURSE _glfw3_HEADER_SEARCH_FILES "${_glfw3_HEADER_SEARCH_DIRS}/*.h")
# add_custom_target(glfw SOURCES ${_glfw3_HEADER_SEARCH_FILES}) # 黑魔法,为了ide服务

INCLUDE(FindPackageHandleStandardArgs)
FIND_PACKAGE_HANDLE_STANDARD_ARGS(GLFW3 DEFAULT_MSG
GLFW3_INCLUDE_DIR)

add_library(glfw::glfw STATIC IMPORTED)
set_target_properties(glfw::glfw PROPERTIES
  IMPORTED_LOCATION ${GLFW3_LIBRARY}
  INTERFACE_INCLUDE_DIRECTORIES ${GLFW3_INCLUDE_DIR}
)