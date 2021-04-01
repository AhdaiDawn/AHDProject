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
//【1】读入一张图片
//【2】在窗口中显示载入的图片imshow（”【载入的图片】"，img）；
//【3】等待6000ms后窗口自动关闭waitKey（6000）；