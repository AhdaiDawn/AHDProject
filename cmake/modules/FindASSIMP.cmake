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
FIND_LIBRARY( ASSIMP_LIBRARY assimp
	/usr/lib64
	/usr/lib
	/usr/local/lib
"${3RD_PARTY_PATH}/assimp/lib" )

INCLUDE(FindPackageHandleStandardArgs)
FIND_PACKAGE_HANDLE_STANDARD_ARGS(ASSIMP DEFAULT_MSG
ASSIMP_INCLUDE_DIR)

add_library(assimp::assimp STATIC IMPORTED)
set_target_properties(assimp::assimp PROPERTIES
  IMPORTED_LOCATION ${ASSIMP_LIBRARY}
  INTERFACE_INCLUDE_DIRECTORIES ${ASSIMP_INCLUDE_DIR}
)