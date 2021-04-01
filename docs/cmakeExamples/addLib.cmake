# Set the project name
project (filament)

# 一些路径
set(FILAMENT_LIB ${PROJECT_SOURCE_DIR}/lib)
set(FILAMENT_INCLUDE ${PROJECT_SOURCE_DIR}/include)

file(GLOB_RECURSE FILAMENT_HEADERS "${FILAMENT_INCLUDE}/*.h")
add_custom_target(filament SOURCES ${FILAMENT_HEADERS}) # 黑魔法,为了ide服务

# 快速添加子Lib
function(add_libraries VAR)
  # 建立每一个子Lib
  foreach (lib ${ARGN})
    add_library(filament::${lib} UNKNOWN IMPORTED)
    set_target_properties(filament::${lib} PROPERTIES
      IMPORTED_LOCATION ${FILAMENT_LIB}/${lib}.lib
      INTERFACE_INCLUDE_DIRECTORIES ${FILAMENT_INCLUDE}
    )
    set(libs ${libs} filament::${lib} )
  endforeach()

  set(libs ${libs} gdi32.lib user32.lib opengl32.lib) # 添加外部依赖
  add_library(filament::${VAR} INTERFACE IMPORTED GLOBAL)
  set_property(TARGET filament::${VAR} PROPERTY
    INTERFACE_LINK_LIBRARIES "${libs}"
    )
endfunction()

add_libraries(all filament backend bluegl bluevk filabridge filaflat utils geometry smol-v ibl vkshaders filamat)