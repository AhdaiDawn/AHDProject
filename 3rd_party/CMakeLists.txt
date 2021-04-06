add_subdirectory(catch2)
add_subdirectory(fmt)
add_subdirectory(tools)

# CMake构建Visual Studio工程时将第三方库放在统一文件夹下
SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON)
SET_PROPERTY(TARGET Catch2 PROPERTY FOLDER "3rd_party")
SET_PROPERTY(TARGET fmt PROPERTY FOLDER "3rd_party")
SET_PROPERTY(TARGET tools PROPERTY FOLDER "3rd_party")
