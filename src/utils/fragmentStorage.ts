import * as FRAGS from "@thatopen/fragments";

// Función para convertir IFC a Base64 y poder guardarlo más adelanten en LocalStorage
export async function convertIFCtoFragmentsBase64(
  file: File,
  serializer: FRAGS.IfcImporter
): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const ifcBytes = new Uint8Array(fileBuffer);
  const fragmentBytes = await serializer.process({ bytes: ifcBytes });

  let binary = "";
  fragmentBytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}
