#version 410

in vec2 texCoord;
in vec3 normWorld;
in vec3 fragPosWorld;
in vec3 biTan;
in vec3 _tan;

uniform sampler2D albedoTex;
uniform sampler2D normalTex;
layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};

out vec4 color;

uniform vec3 lightPosWorld;
uniform float lightIntensity;
uniform float specularity;

void main()
{
	vec3 lightDir = normalize(lightPosWorld - fragPosWorld);
	vec3 viewDir = normalize(cameraPos.xyz - fragPosWorld);
	float lightDistance = length(lightPosWorld - fragPosWorld);
	vec4 albedo = texture(albedoTex, texCoord);
	vec4 normal = texture(normalTex, texCoord);

	// --- Your Code Here
	// Note that we're just using the mesh normal here (transformed to world space)
	// Change this to sample your normal map texture, and use it to adjust the normal.
	// Remember to rescale the normal from [0,1] to [-1,1]

	//vec4 normalColor = vec4((normal.xyz * 2) - 1);
	vec3 normScaled = vec3((normal.xyz * 2 ) -1);
	vec3 mapNormal = (normScaled.x * _tan, normScaled.y * biTan, normScaled.z * normWorld);
	vec4 diffuseColor = vec4(albedo.xyz * dot(normWorld, lightDir), 1.0f);
	float specularPower = pow(clamp(dot(reflect(lightDir, mapNormal), -viewDir), 0, 1), specularity);
	vec4 specularColor = vec4(specularPower * vec3(1,1,1), 1.0);

	color = lightIntensity * (diffuseColor + specularColor) / (lightDistance*lightDistance);
}

