#version 330 core
out vec4 FragColor;

uniform vec3 lightColors;

void main()
{
    FragColor = vec4(lightColors,1.0f); // set alle 4 vector values to 1.0
}