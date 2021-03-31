#define CATCH_CONFIG_MAIN
#include "catch2/catch.hpp"
#include "AHDExample/AHDExample.h"

TEST_CASE( "simple number test" )
{
    AHDExample example;
    example.print();
    int a = 1;
    REQUIRE( a == 1 );
}