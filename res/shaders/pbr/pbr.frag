#version 330 core
out vec4 FragColor;
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;

// material parameters
uniform sampler2D albedoMap;
uniform sampler2D normalMap;
uniform sampler2D ramMap; // roughness ao metallic

// IBL
uniform samplerCube irradianceMap; // 辐照度贴图==>间接漫反射
uniform samplerCube prefilterMap; // 预滤波环境贴图==>反射方程的镜面部分
uniform sampler2D brdfLUT; //BRDF积分贴图==>

//shadow
uniform float far_plane;
uniform samplerCube depthMap;

// lights
uniform vec3 lightPositions;
uniform vec3 lightColors;

uniform bool DisplayBackground;
uniform bool EnablePBR;

uniform vec3 camPos;

const float PI = 3.14159265359;

// array of offset direction for sampling
vec3 gridSamplingDisk[20] = vec3[]
(
   vec3(1, 1,  1), vec3( 1, -1,  1), vec3(-1, -1,  1), vec3(-1, 1,  1),
   vec3(1, 1, -1), vec3( 1, -1, -1), vec3(-1, -1, -1), vec3(-1, 1, -1),
   vec3(1, 1,  0), vec3( 1, -1,  0), vec3(-1, -1,  0), vec3(-1, 1,  0),
   vec3(1, 0,  1), vec3(-1,  0,  1), vec3( 1,  0, -1), vec3(-1, 0, -1),
   vec3(0, 1,  1), vec3( 0, -1,  1), vec3( 0, -1, -1), vec3( 0, 1, -1)
);

float ShadowCalculation(vec3 fragPos)
{
    // get vector between fragment position and light position
    vec3 fragToLight = fragPos - lightPositions;
    // use the fragment to light vector to sample from the depth map
    // float closestDepth = texture(depthMap, fragToLight).r;
    // it is currently in linear range between [0,1], let's re-transform it back to original depth value
    // closestDepth *= far_plane;
    // now get current linear depth as the length between the fragment and light position
    float currentDepth = length(fragToLight);
    // test for shadows
    // float bias = 0.05; // we use a much larger bias since depth is now in [near_plane, far_plane] range
    // float shadow = currentDepth -  bias > closestDepth ? 1.0 : 0.0;
    // PCF
    // float shadow = 0.0;
    // float bias = 0.05;
    // float samples = 4.0;
    // float offset = 0.1;
    // for(float x = -offset; x < offset; x += offset / (samples * 0.5))
    // {
        // for(float y = -offset; y < offset; y += offset / (samples * 0.5))
        // {
            // for(float z = -offset; z < offset; z += offset / (samples * 0.5))
            // {
                // float closestDepth = texture(depthMap, fragToLight + vec3(x, y, z)).r; // use lightdir to lookup cubemap
                // closestDepth *= far_plane;   // Undo mapping [0;1]
                // if(currentDepth - bias > closestDepth)
                    // shadow += 1.0;
            // }
        // }
    // }
    // shadow /= (samples * samples * samples);
    float shadow = 0.0f;
    float bias = 0.15f;
    int samples = 20;
    float viewDistance = length(camPos - WorldPos);
    float diskRadius = (1.0f + (viewDistance / far_plane)) / 25.0f;
    for(int i = 0; i < samples; ++i)
    {
        float closestDepth = texture(depthMap, fragToLight + gridSamplingDisk[i] * diskRadius).r;
        closestDepth *= far_plane;   // undo mapping [0;1]
        if(currentDepth - bias > closestDepth)
            shadow += 1.0f;
    }
    shadow /= float(samples);

    // display closestDepth as debug (to visualize depth cubemap)
    // FragColor = vec4(vec3(closestDepth / far_plane), 1.0);

    return shadow;
}
// ----------------------------------------------------------------------------
// Easy trick to get tangent-normals to world-space to keep PBR code simplified.
vec3 getNormalFromMap()
{
    vec3 tangentNormal = texture(normalMap, TexCoords).xyz * 2.0f - 1.0f;

    vec3 Q1  = dFdx(WorldPos);
    vec3 Q2  = dFdy(WorldPos);
    vec2 st1 = dFdx(TexCoords);
    vec2 st2 = dFdy(TexCoords);

    vec3 N   = normalize(Normal);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}
// ----------------------------------------------------------------------------
float DistributionGGX(vec3 N, vec3 H, float roughness) // 法线分布函数
{
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0f);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0f) + 1.0f);
    denom = PI * denom * denom;

    return nom / denom;
}
//天鹅绒
float D_Charlie(float roughness, float NoH) {
    // Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"
    float invAlpha  = 1.0f / roughness;
    float cos2h = NoH * NoH;
    float sin2h = max(1.0f - cos2h, 0.0078125f); // 2^(-14/2), so sin2h^2 > 0 in fp16
    return (2.0f + invAlpha) * pow(sin2h, invAlpha * 0.5f) / (2.0f * PI);
}
// ----------------------------------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0f);
    float k = (r*r) / 8.0f;

    float nom   = NdotV;
    float denom = NdotV * (1.0f - k) + k;

    return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) //几何函数
{
    float NdotV = max(dot(N, V), 0.0f);
    float NdotL = max(dot(N, L), 0.0f);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
// ----------------------------------------------------------------------------
vec3 fresnelSchlick(float cosTheta, vec3 F0) // 菲涅尔项
{
    return F0 + (1.0f - F0) * pow(1.0f - cosTheta, 5.0f);
}
// ----------------------------------------------------------------------------
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
    return F0 + (max(vec3(1.0f - roughness), F0) - F0) * pow(1.0f - cosTheta, 5.0f);
}
// ----------------------------------------------------------------------------
// HDR tonemapping
vec3 whitePreservingLumaBasedReinhardToneMapping(vec3 color)
{
	float white = 2.f;
	float luma = dot(color, vec3(0.2126f, 0.7152f, 0.0722f));
	float toneMappedLuma = luma * (1.f + luma / (white*white)) / (1.f + luma);
	color *= toneMappedLuma / luma;
	return color;
}

vec3 Tonemap_ACES(vec3 x) {
    // Narkowicz 2015, "ACES Filmic Tone Mapping Curve"
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return (x * (a * x + b)) / (x * (c * x + d) + e);
}

// ----------------------------------------------------------------------------
void main()
{
    if(EnablePBR)
    {
        // material properties
        vec3 albedo = pow(texture(albedoMap, TexCoords).rgb, vec3(2.2f));
        float roughness = texture(ramMap, TexCoords).r;
        float ao = texture(ramMap, TexCoords).g;
        float metallic = texture(ramMap, TexCoords).b;

        // input lighting data
        vec3 N = getNormalFromMap();
        vec3 V = normalize(camPos - WorldPos);
        vec3 R = reflect(-V, N);

        // 计算法向入射时的反射率; 如果为电介质（塑料）使用F0=0.04；如果是金属，使用albedo作为F0（金属工作流）
        vec3 F0 = vec3(0.04f);
        F0 = mix(F0, albedo, metallic);

        // 反射率方程
        vec3 Lo = vec3(0.0f);
        {
            // calculate per-light radiance
            vec3 L = normalize(lightPositions - WorldPos);
            vec3 H = normalize(V + L);
            float distance = length(lightPositions - WorldPos);
            float attenuation = 1.0f / (distance * distance);
            vec3 radiance = lightColors * attenuation;

            // Cook-Torrance BRDF
            float NDF = DistributionGGX(N, H, roughness);
            // float NDF = D_Charlie( roughness,dot(N,H));
            float G   = GeometrySmith(N, V, L, roughness);
            vec3 F    = fresnelSchlick(max(dot(H, V), 0.0f), F0);

            vec3 nominator    = NDF * G * F;
            float denominator = 4 * max(dot(N, V), 0.0f) * max(dot(N, L), 0.0f) + 0.001f; // 0.001 to prevent divide by zero.
            vec3 specular = nominator / denominator;

             // kS is equal to Fresnel
            vec3 kS = F;
            // for energy conservation, the diffuse and specular light can't
            // be above 1.0 (unless the surface emits light); to preserve this
            // relationship the diffuse component (kD) should equal 1.0 - kS.
            vec3 kD = vec3(1.0f) - kS;
            // multiply kD by the inverse metalness such that only non-metals
            // have diffuse lighting, or a linear blend if partly metal (pure metals
            // have no diffuse light).
            kD *= 1.0f - metallic;

            // scale light by NdotL
            float NdotL = max(dot(N, L), 0.0f);

            // add to outgoing radiance Lo
            Lo += (kD * albedo / PI + specular) * radiance * NdotL; // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
        }

        // ambient lighting (we now use IBL as the ambient term)
        vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0f), F0, roughness);

        vec3 kS = F;
        vec3 kD = 1.0f - kS;
        kD *= 1.0f - metallic;

        vec3 irradiance = texture(irradianceMap, N).rgb; // 使用法线采样
        vec3 diffuse      = irradiance * albedo;

        // 对预过滤器图和BRDF lut进行采样，并按照Split-Sum近似将它们组合在一起，得到IBL镜面反射部分。
        const float MAX_REFLECTION_LOD = 4.0f;
        vec3 prefilteredColor = textureLod(prefilterMap, R,  roughness * MAX_REFLECTION_LOD).rgb;
        vec2 brdf  = texture(brdfLUT, vec2(max(dot(N, V), 0.0f), roughness)).rg;
        vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);

        vec3 ambient;
        if(DisplayBackground)
            ambient = (kD * diffuse + specular) * ao; //基于图像
        else
            ambient = vec3(0.5f) * albedo * ao; //

        float shadow = ShadowCalculation(WorldPos);
        vec3 color = ambient + Lo*(1.0f - shadow);
        // vec3 color = ambient + Lo;

        // HDR tonemapping
        // color = color / (color + vec3(1.0));
        // color = whitePreservingLumaBasedReinhardToneMapping(color);
        color =  Tonemap_ACES(color);
        // gamma correct
        color = pow(color, vec3(1.0f/2.2f));

       FragColor = vec4(color , 1.0f);
        // if(gl_FragCoord.x < 640)
        //     FragColor = vec4(color , 1.0);
        // else
        //     FragColor = vec4(vec3(color.z),1.0);
    }
    else
    {
        vec3 color = pow(texture(albedoMap, TexCoords).rgb,vec3(2.2f));
        // ambient
        vec3 ambient = 0.35f * color;//手动调
        // diffuse
        vec3 lightDir = normalize(lightPositions - WorldPos);
        vec3 normal = getNormalFromMap();
        float diff = max(dot(lightDir, normal), 0.0f);
        vec3 diffuse = diff * color;
        // specular
        vec3 viewDir = normalize(camPos - WorldPos);
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = 0.0f;
        vec3 halfwayDir = normalize(lightDir + viewDir);
        spec = pow(max(dot(normal, halfwayDir), 0.0f), 16.0f);
        vec3 specular = vec3(0.03f) * spec; // assuming bright white light color
        float shadow = ShadowCalculation(WorldPos);
        vec3 out_color = ambient + (1.0f - shadow) * (diffuse + specular);
        // vec3 out_color = ambient + diffuse + specular;
        // HDR tonemapping
        // out_color = out_color / (out_color + vec3(1.0));
        // out_color = whitePreservingLumaBasedReinhardToneMapping(out_color);
        out_color = Tonemap_ACES(out_color);
        // gamma correct
        out_color = pow(out_color, vec3(1.0f/2.2f));

       FragColor = vec4(out_color , 1.0f);
    //     if(gl_FragCoord.x < 640)
    //         FragColor = vec4(out_color , 1.0);
    //     else
    //         FragColor = vec4(vec3(out_color.z),1.0);
    }
}