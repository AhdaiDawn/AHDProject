# Set the minimum version of CMake that can be used # To find the cmake version run
# $ cmake --version
cmake_minimum_required(VERSION 3.5)

# Set the project name
project(FilamentDemo)

# Create the executable
add_executable(${PROJECT_NAME} src/main.cpp)

set(CMAKE_CXX_FLAGS_RELEASE "-MT")
set(CMAKE_CXX_FLAGS_DEBUG "-MT")
target_link_options(${PROJECT_NAME} PRIVATE "/SUBSYSTEM:WINDOWS")

find_package(Filament REQUIRED)
find_package(GLM REQUIRED)

target_link_libraries(${PROJECT_NAME} PRIVATE
    filament::all
    glm::glm
)
target_include_directories( ${PROJECT_NAME}
    PRIVATE ${PROJECT_SOURCE_DIR}/include
)
