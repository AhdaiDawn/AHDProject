add_subdirectory(catch2)
add_subdirectory(fmt-7.1.3)
add_subdirectory(spdlog-1.8.2)
add_subdirectory(filament-v1.9.17-windows)

# CMake构建Visual Studio工程时将第三方库放在统一文件夹下
SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON)
SET_PROPERTY(TARGET Catch2 PROPERTY FOLDER "3rd_party")
SET_PROPERTY(TARGET fmt PROPERTY FOLDER "3rd_party")
SET_PROPERTY(TARGET spdlog PROPERTY FOLDER "3rd_party")
SET_PROPERTY(TARGET filament PROPERTY FOLDER "3rd_party")