# - Try to find Assimp
# Once done, this will define
#
# ASSIMP_FOUND - system has Assimp
# ASSIMP_INCLUDE_DIR - the Assimp include directories
# ASSIMP_LIBRARIES - link these to use Assimp
FIND_PATH( ASSIMP_INCLUDE_DIR assimp/mesh.h
	/usr/include
	/usr/local/include
	/opt/local/include
"${3RD_PARTY_PATH}/assimp/include" )
FIND_LIBRARY( ASSIMP_LIBRARY assimp-vc142-mtd.lib
	/usr/lib64
	/usr/lib
	/usr/local/lib
"${3RD_PARTY_PATH}/assimp/lib" )

find_file(ASSIMP_DLL_FILE assimp-vc142-mtd.dll
"${3RD_PARTY_PATH}/assimp/lib")
INCLUDE(FindPackageHandleStandardArgs)
FIND_PACKAGE_HANDLE_STANDARD_ARGS(ASSIMP DEFAULT_MSG
ASSIMP_INCLUDE_DIR)

add_library(assimp::assimp SHARED IMPORTED)
set_target_properties(assimp::assimp PROPERTIES
  IMPORTED_IMPLIB ${ASSIMP_LIBRARY}
  IMPORTED_LOCATION ${ASSIMP_DLL_FILE}
  INTERFACE_INCLUDE_DIRECTORIES ${ASSIMP_INCLUDE_DIR}
)

# 复制到二进制运行目录
if(WIN32)
	find_file(BIN_ASSIMP_DLL_FILE assimp-vc142-mtd.dll
		"${CMAKE_RUNTIME_OUTPUT_DIRECTORY}")
	if(NOT BIN_ASSIMP_DLL_FILE)
		file(COPY ${ASSIMP_DLL_FILE} DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
	endif()
endif(WIN32)