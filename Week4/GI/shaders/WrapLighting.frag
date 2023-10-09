
#version 410

uniform sampler2D albedoTexture;

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 worldPos;
in vec2 texCoord;

out vec4 colorOut;
uniform vec4 color;
uniform vec3 lightPosWorld;
uniform float lightIntensity;



void main()
{
	vec3 albedo = texture(albedoTexture, texCoord).xyz;
	vec3 lightDir = normalize(lightPosWorld - worldPos);
	vec3 viewDir = normalize(cameraPos.xyz - worldPos);
	float lightDistance = length(lightPosWorld - worldPos);

	colorOut.xyz = albedo;
	colorOut.a = 1.0;
	// Add your illumination code here!

		vec3 diffuse = albedo.rgb  *  clamp( dot( lightDir, worldNorm), 0, 1);
		
		colorOut.rgb = (diffuse);


	//colorOut.xyz = albedo;
	//colorOut.a = 1.0;
}

