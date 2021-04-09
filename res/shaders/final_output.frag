#version 330 core
out vec4 FragColor;

in VS_OUT {
    vec3 FragPos;
    vec3 Normal;
    vec2 TexCoords;
} fs_in;

uniform int displayMode;
uniform vec3 lightPos;
uniform vec3 viewPos;

float near = 0.1; 
float far = 100.0; 
float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));	
}
void main()
{
    if(displayMode==0){
    vec3 color = vec3(1.0f, 1.0f, 1.0f);

    // ambient
    vec3 ambient = 0.5 * color;
    // diffuse
    vec3 lightDir = normalize(lightPos - fs_in.FragPos);
    vec3 normal = normalize(fs_in.Normal);
    float diff = max(dot(lightDir, normal), 0.0);
    vec3 diffuse = diff * color;
    // specular
    vec3 viewDir = normalize(viewPos - fs_in.FragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = 0.0;
    //blinn
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);


    vec3 specular = vec3(0.3) * spec; // assuming bright white light color
    FragColor = vec4(ambient + diffuse + specular, 1.0);
//    FragColor = vec4(1.0,1.0,1.0, 1.0);
    }

    if(displayMode==3){
        FragColor = vec4(fs_in.FragPos,1.0f);
    }

    if(displayMode==4){
    float depth = LinearizeDepth(gl_FragCoord.z) / far; // divide by far to get depth in range [0,1] for visualization purposes
    FragColor = vec4(vec3(depth), 1.0);
//        FragColor = vec4(vec3(gl_FragCoord.z),1.0);
    }

}
//enum DisplayMode
//{
//    DISPLAY_MODE_FULL = 0,
//    DISPLAY_MODE_ALBEDO,
//    DISPLAY_MODE_EYE_NORMAL,
//    DISPLAY_MODE_EYE_POSITION,
//    DISPLAY_MODE_DEPTH,
//    DISPLAY_MODE_ROUGHNESS,
//    DISPLAY_MODE_METALNESS,
//    DISPLAY_MODE_AO,
//    DISPLAY_MODE_COUNT
//};
