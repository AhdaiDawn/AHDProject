#include <opencv2/opencv.hpp>
#include <cstdio>
#include "tools/filesystem.h"
using namespace cv;

int main (void)
{
   printf("load opencv...\n");
	Mat img = imread(FileSystem::getPath("res/textures/1.jpg"));
	imshow("1.jpg", img);
	waitKey(6000);
   return 0;
}