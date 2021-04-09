# Set the minimum version of CMake that can be used
# To find the cmake version run
# $ cmake --version
cmake_minimum_required(VERSION 3.5)

# Set the project name
project (AHDOpenGL)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

file(GLOB_RECURSE AHDOPENGl_SOURCES "${PROJECT_SOURCE_DIR}/include/*.h")
# Add an executable
add_executable(AHDOpenGL main.cpp stb_image.cpp ${AHDOPENGl_SOURCES})

# find the required packages
find_package(GLFW3 REQUIRED)
find_package(GLAD REQUIRED)
find_package(GLM REQUIRED)
find_package(ASSIMP REQUIRED)
find_package(Filament REQUIRED)
find_package(QT NAMES Qt6 Qt5 COMPONENTS Gui Core REQUIRED)
find_package(Qt${QT_VERSION_MAJOR} COMPONENTS Gui Core REQUIRED)

target_include_directories( ${PROJECT_NAME}
    PUBLIC ${PROJECT_SOURCE_DIR}/include
)

target_link_libraries(${PROJECT_NAME} PRIVATE
    tools::tools
    glfw::glfw
    glad::glad
    glm::glm
    assimp::assimp
    opengl32.lib
    Qt${QT_VERSION_MAJOR}::Core
    Qt${QT_VERSION_MAJOR}::Gui
)
