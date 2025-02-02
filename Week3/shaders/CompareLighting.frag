
#version 410

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 fragPosWorld;
in vec2 texCoord;

out vec4 colorOut;

uniform vec4 albedo;
uniform float specularExponent;
uniform float specularIntensity;

uniform int lightingMode;
uniform vec3 lightPosWorld;
uniform float lightIntensity;

void main()
{
	vec3 lightDir = normalize(lightPosWorld - fragPosWorld);
	vec3 viewDir = normalize(cameraPos.xyz - fragPosWorld);
	float lightDistance = length(lightPosWorld - fragPosWorld);

	colorOut = albedo;

	if(lightingMode == 0) {
		// Render with original Phong lighting model
		// --- Your Code Here ---
		vec3 diffuse = albedo.rgb  *  clamp( dot( lightDir, worldNorm), 0, 1);
		float spec = (pow( clamp( dot(-reflect(lightDir, worldNorm), viewDir), 0, 1), specularExponent) * specularIntensity);
		
		colorOut.rgb = (diffuse + spec) * lightIntensity / (lightDistance * lightDistance);
		
	} else if(lightingMode == 1) {
		// Render with Blinn-Phong
		// --- Your Code Here ---
		
		float specHighExponent = specularExponent * 2;
		vec3 diffuse = albedo.rgb  *  clamp( dot( lightDir, worldNorm), 0, 1);
		float spec = (pow( clamp( dot(normalize(lightDir + viewDir), worldNorm), 0, 1), specHighExponent) * specularIntensity);
		
		colorOut.rgb = (diffuse + spec) * lightIntensity / (lightDistance * lightDistance);
	} else if(lightingMode == 2) {
		// Render with Modified Blinn-Phong
		// --- Your Code Here ---
		float specHighExponent = specularExponent * 2;
		vec3 diffuse = albedo.rgb;
		float spec = (pow( clamp( dot(normalize(lightDir + viewDir), worldNorm), 0, 1), specHighExponent) * specularIntensity);
		
		colorOut.rgb = ((diffuse + spec) * lightIntensity / (lightDistance * lightDistance)) * clamp( dot(lightDir, worldNorm), 0, 1);
	} else if(lightingMode == 3) {
		// Render with Modified Blinn-Phong, Normalized
		// --- Your Code Here ---
		float specHighExponent = specularExponent * 2;
		vec3 diffuse = albedo.rgb;
		float specNorm = (specularIntensity + 8) / 8;
		float spec = ((pow( clamp( dot(normalize(lightDir + viewDir), worldNorm), 0, 1), specHighExponent ) * specNorm) * specularIntensity);
		
		colorOut.rgb = ((diffuse + spec) * lightIntensity / (lightDistance * lightDistance)) * clamp( dot(lightDir, worldNorm), 0, 1);
	}
}

