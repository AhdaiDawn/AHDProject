# Set the minimum version of CMake that can be used
# To find the cmake version run
# $ cmake --version
cmake_minimum_required(VERSION 3.5)

# Set the project name
project (AHDOpenCV)

# Add an executable
add_executable(AHDOpenCV main.cpp)

set (OpenCV_DIR "D:/opencv/build/x64/vc15/lib")
find_package(OpenCV 4.5.1 REQUIRED)

# find the required packages
find_package(GLFW3 REQUIRED)

target_link_libraries(${PROJECT_NAME} PRIVATE
    tools::tools
    ${OpenCV_LIBS}
    glfw::glfw
)
