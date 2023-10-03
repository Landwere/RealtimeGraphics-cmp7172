
#version 410

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 worldTangent;
in vec3 fragPosWorld;
in vec2 texCoord;

in vec3 BiTangent;

out vec4 colorOut;
uniform vec4 color;
uniform vec3 lightPosWorld;
uniform sampler2D texture;
uniform vec3 hairColor;
uniform float specularIntensity;
uniform float specularExponent;

uniform float selfShadowMin;
uniform float selfShadowFadeoutWidth;

void main()
{
	vec3 albedo = texture2D(texture, texCoord).rgb;

	//colorOut.rgb = albedo * hairColor;

		vec3 lightDir = normalize(lightPosWorld - fragPosWorld);
	vec3 viewDir = normalize(cameraPos.xyz - fragPosWorld);
	float lightDistance = length(lightPosWorld - fragPosWorld);

	// --- Your Code Here ---
	// Implement the Kajiya-Kay anisotropic shader.

	//based off Phong lighting model code
	float selfShadowFloat = clamp((dot(lightDir, worldNorm) / selfShadowFadeoutWidth) + selfShadowMin, 0, 1);

	vec3 diffuse = albedo.rgb  * sqrt(pow( selfShadowFloat, 2)) * hairColor; 
	float spec = (pow( sqrt( pow( dot(normalize(-lightDir + viewDir), worldTangent),2 )), specularExponent) * specularIntensity);		
	
	colorOut.rgb = (diffuse + spec);

	colorOut.a = 1.0;
}

