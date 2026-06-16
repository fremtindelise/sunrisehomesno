import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";
import type { Property } from "./types";

const DEFAULT_AWS_REGION = "eu-west-1";

function getAwsRegion(): string {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || DEFAULT_AWS_REGION;
}

function getAwsCredentials() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return undefined;
  return { accessKeyId, secretAccessKey };
}

function createTranslateClient(): TranslateClient | null {
  const credentials = getAwsCredentials();
  if (!credentials) return null;
  return new TranslateClient({
    region: getAwsRegion(),
    credentials,
  });
}

async function translateTextToNorwegian(
  client: TranslateClient,
  text: string,
): Promise<string> {
  const response = await client.send(
    new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: "en",
      TargetLanguageCode: "no",
    }),
  );

  return response.TranslatedText ?? text;
}

async function translateTextsToNorwegian(
  texts: string[],
): Promise<Map<string, string>> {
  const client = createTranslateClient();
  if (!client) return new Map();

  const uniqueTexts = [...new Set(texts.map((text) => text.trim()))].filter(
    Boolean,
  );
  const translations = new Map<string, string>();

  for (const text of uniqueTexts) {
    translations.set(text, await translateTextToNorwegian(client, text));
  }

  return translations;
}

async function translatePropertyDescriptionsToNorwegian(
  properties: Property[],
): Promise<Property[]> {
  const descriptions = properties
    .map((property) => property.description)
    .filter((description) => description.trim().length > 0);

  if (descriptions.length === 0) return properties;

  let translations: Map<string, string>;
  try {
    translations = await translateTextsToNorwegian(descriptions);
  } catch (error) {
    console.error(
      "AWS Translate failed; using original descriptions.",
      error instanceof Error ? error.message : error,
    );
    return properties;
  }

  if (translations.size === 0) return properties;

  return properties.map((property) => {
    const translatedDescription = translations.get(property.description.trim());
    if (!translatedDescription) return property;
    return {
      ...property,
      description: translatedDescription,
    };
  });
}

async function translatePropertyFeaturesToNorwegian(
  property: Property,
): Promise<Property> {
  const features = property.features
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (features.length === 0) return property;

  let translations: Map<string, string>;
  try {
    translations = await translateTextsToNorwegian(features);
  } catch (error) {
    console.error(
      "AWS Translate failed for features; using originals.",
      error instanceof Error ? error.message : error,
    );
    return property;
  }

  if (translations.size === 0) return property;

  return {
    ...property,
    features: property.features.map(
      (feature) => translations.get(feature.trim()) ?? feature,
    ),
  };
}

export async function translatePropertyDescriptionToNorwegian(
  property: Property,
): Promise<Property> {
  const [translatedProperty] = await translatePropertyDescriptionsToNorwegian([
    property,
  ]);
  return translatedProperty ?? property;
}

export async function translatePropertyDetailToNorwegian(
  property: Property,
): Promise<Property> {
  const withDescription =
    property.source === "mojacar"
      ? await translatePropertyDescriptionToNorwegian(property)
      : property;
  return translatePropertyFeaturesToNorwegian(withDescription);
}
