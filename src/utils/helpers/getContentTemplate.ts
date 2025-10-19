export default function getContentTemplate(content: string) {
  if (content?.startsWith('"')) {
    return JSON?.parse(content);
  } else {
    return content;
  }
}
