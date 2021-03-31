#############################################
# Unit tests

# enable CTest testing
enable_testing()

# Add a testing executable
add_executable(AHDExampleTest unit_tests.cpp)

target_link_libraries(AHDExampleTest
    Catch2::Test
    AHDExample::AHDExample
)
