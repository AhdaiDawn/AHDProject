#############################################
# Unit tests
add_subdirectory(AHDExampleTest)

SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON)

SET_PROPERTY(TARGET AHDExampleTest PROPERTY FOLDER "Tests")

# enable CTest testing
enable_testing()

add_test(test_all AHDExampleTest)
